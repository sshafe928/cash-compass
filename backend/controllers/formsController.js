const asyncWrapper = require('../middleware/async');
const Savings = require('../models/Savings');
const savingsItems = require('../models/savingsItems');
const debtItems = require('../models/debtItems');
const Income_entry = require('../models/Income_entry');
const Expense_entry = require('../models/Expense_entry');

const getForms = async (req, res) => {
  try {
    // Calculate total savings
    const savings = await Savings.find({ category: "Saving" }); // Add user filtering if needed
    const totalSavings = savings.reduce((acc, item) => {
      return item.where === "in" ? acc + item.amount : acc - item.amount;
    }, 0);
    const totalSavingsFormatted = totalSavings.toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD'
    });

    // Fetch and format goals
    const goals = await savingsItems.find({ category: { $nin: ["Saving", "Expense", "Debt", "Budget", "Income"] } }); // Add user filtering if needed
    
    const formattedGoals = goals.map(goal => ({
      id: goal._id.toString(),
      title: goal.title,
      goalAmount: goal.goalAmount !== undefined ? goal.goalAmount : 0,
      currentAmount: goal.currentAmount !== undefined ? goal.currentAmount : 0, 
    }));

    // Get debt items
    const Items = await debtItems.find({ category: "Debt" }); // Add user filtering if needed
    const formattedDebtItems = Items.map(item => ({
      id: item._id.toString(),
      title: item.title,
      currentAmount: item.currentAmount,
    }));

    // Send the response with all data
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
  // Correctly extract the nested 'data'
  const { data } = req.body;
  const user = "user123"; // Replace with session user or proper user id

  try {
    await Income_entry.create({
      category: data.category,
      amount: data.entryAmount,
      where: data.where,
      user: user,
      date: data.entryDate,
      notes: data.notes
    });
    res.status(200).json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Error creating income: ' + error.message });
  }
});

const createExpense = asyncWrapper(async (req, res) => {
  const { data } = req.body;
  const user = "user123";

  try {
    await Expense_entry.create({
      category: data.category,
      amount: data.entryAmount,
      where: data.where,
      user: user,
      date: data.entryDate,
      notes: data.notes
    });
    res.status(200).json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Error creating expense: ' + error.message });
  }   
});

const moveDebt = asyncWrapper(async (req, res) => {
  const { type, ...data } = req.body;

  try {
    const result = await saveIncome(data); // Ensure saveIncome is defined or adjust accordingly
    res.status(200).json(result);  
  } catch (error) {
    res.status(500).json({ error: 'Error moving debt: ' + error.message });
  }
});

const moveGoals = asyncWrapper(async (req, res) => {
  const { type, ...data } = req.body;

  try {
    const result = await saveIncome(data);
    res.status(200).json(result);  
  } catch (error) {
    res.status(500).json({ error: 'Error moving goals: ' + error.message });
  }
});

const moveSavings = asyncWrapper(async (req, res) => {
  const { type, ...data } = req.body;

  try {
    const result = await saveIncome(data);
    res.status(200).json(result);  
  } catch (error) {
    res.status(500).json({ error: 'Error moving savings: ' + error.message });
  }
});

module.exports = {
  getForms,
  createIncome,
  createExpense,
  moveDebt,
  moveGoals,
  moveSavings
};
