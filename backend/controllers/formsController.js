const asyncWrapper = require('../middleware/async');
const Savings = require('../models/Savings');            // For direct savings submissions
const Goals = require('../models/savingsItems');           // For goal transactions (i.e. updating an existing goal)
const Debt = require('../models/debtItems');               // For debt items (updating or creating)
const Income_entry = require('../models/Income_entry');
const Expense_entry = require('../models/Expense_entry');
const User = require('../models/User'); // Import the User model


const getForms = async (req, res) => {
  try {
    // Filter by authenticated user
    const savings = await Savings.find({ category: "Saving", user: req.user._id });
    const totalSavings = savings.reduce((acc, item) => {
      return item.where === "in" ? acc + item.amount : acc - item.amount;
    }, 0);
    const totalSavingsFormatted = totalSavings.toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD'
    });

    const goals = await Goals.find({ category: { $nin: ["Saving", "Expense", "Debt", "Budget", "Income"] }, user: req.user._id });
    const formattedGoals = goals.map(goal => ({
      id: goal._id.toString(),
      title: goal.title,
      goalAmount: goal.goalAmount || 0,
      currentAmount: goal.currentAmount || 0, 
    }));

    const debts = await Debt.find({ category: "Debt", user: req.user._id });
    const formattedDebtItems = debts.map(item => ({
      id: item._id.toString(),
      title: item.title,
      currentAmount: item.currentAmount,
    }));

    res.status(200).json({
      success: true,
      totalSavings: totalSavingsFormatted,
      savingItems: formattedGoals,
      debtItems: formattedDebtItems,
    });

  } catch (error) {
    console.error("Error occurred in getForms:", error);
    res.status(500).json({
      success: false,
      message: "Something went wrong. Please try again later."
    });
  }
};

const createIncome = asyncWrapper(async (req, res) => {
    const { data } = req.body;
    console.log("Received income data:", data);
    
    if (!data || !data.entryDate || !data.entryAmount || !data.where) {
      return res.status(400).json({ error: "Missing required income fields" });
    }
    
    const user = req.user._id;
    const entryAmount = data.entryAmount;
    
    try {
      // Create the income transaction
      const income = await Income_entry.create({
        category: data.category,
        amount: entryAmount,
        where: data.where,
        user: user,
        date: new Date(data.entryDate),
        notes: data.notes
      });
      console.log("Income created:", income);
      
      // Update the user's balance (increase for income)
      const updatedUser = await User.findByIdAndUpdate(
        user,
        { $inc: { userMoney: entryAmount } },
        { new: true }
      );
      
      res.status(200).json({ success: true, updatedUserMoney: updatedUser.userMoney });
    } catch (error) {
      console.error("Error creating income:", error);
      res.status(500).json({ error: 'Error creating income: ' + error.message });
    }
  });

const createExpense = asyncWrapper(async (req, res) => {
    const { data } = req.body;
    const user = req.user._id;
    const entryAmount = data.entryAmount;
    
    try {
      // Create the expense transaction
      await Expense_entry.create({
        category: data.category,
        amount: entryAmount,
        where: data.where,
        user: user,
        date: new Date(data.entryDate),
        notes: data.notes
      });
      
      // Update the user's balance (decrease for expense)
      const updatedUser = await User.findByIdAndUpdate(
        user,
        { $inc: { userMoney: -entryAmount } },
        { new: true }
      );
      
      res.status(200).json({ success: true, updatedUserMoney: updatedUser.userMoney });
    } catch (error) {
      res.status(500).json({ error: 'Error creating expense: ' + error.message });
    }
  });
  

// For savings, if the submission is for direct savings use Savings model;
// if it's for a goal (category "Goals"), update the matching goal's currentAmount.
const moveSavings = asyncWrapper(async (req, res) => {
  const { data } = req.body;
  const user = req.user._id;
  if (data.category === "Saving") {
    // Create a new direct savings record
    const saving = await Savings.create({
      category: data.category,
      amount: data.entryAmount,
      where: data.where, // for direct savings, 'where' might be the savings account name
      user: user,
      date: new Date(data.entryDate),
      notes: data.notes
    });
    return res.status(200).json({ success: true, saving });
  } else if (data.category === "Goals") {
    // Update an existing goal: use data.where as the goal title
    const goal = await Goals.findOneAndUpdate(
      { title: data.where, user: user },
      { $inc: { currentAmount: data.entryAmount } },
      { new: true }
    );
    if (!goal) {
      return res.status(404).json({ error: "Goal not found" });
    }
    return res.status(200).json({ success: true, goal });
  } else {
    return res.status(400).json({ error: "Invalid savings category" });
  }
});

// For debt, update the debt item if it exists, otherwise create a new debt record.
// We use data.debtCategory as the title.
const moveDebt = asyncWrapper(async (req, res) => {
  const { data } = req.body;
  const user = req.user._id;
  // Assume data.debtAction is "Adding" or "Paying"
  const increment = data.debtAmount;
  let debtItem = await Debt.findOne({ title: data.debtCategory, user: user });
  if (!debtItem) {
    // Create a new debt item with default values
    debtItem = await Debt.create({
      category: "Debt",
      icon: "default-icon", // Provide a default icon value
      currentAmount: data.debtAction === "Adding" ? increment : -increment,
      title: data.debtCategory,
      user: user,
      date: new Date(data.debtDate),
      color: "#FF0000",
      description: "",
      notes: data.debtDescription
    });
    return res.status(200).json({ success: true, debt: debtItem });
  } else {
    // Update currentAmount based on debt action
    if (data.debtAction === "Adding") {
      debtItem.currentAmount += increment;
    } else if (data.debtAction === "Paying") {
      debtItem.currentAmount -= increment;
    }
    await debtItem.save();
    return res.status(200).json({ success: true, debt: debtItem });
  }
});

module.exports = {
  getForms,
  createIncome,
  createExpense,
  moveDebt,
  moveSavings,
  // If you call moveGoals separately, you could simply alias it:
  moveGoals: moveSavings
};
