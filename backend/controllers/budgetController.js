const asyncWrapper = require('../middleware/async');
const budgetItems = require("../models/budgetItems");
const savingItems = require("../models/savingsItems");
const debtItems = require("../models/debtItems");
const expenses = require('../models/Expense_entry');
const { ObjectId } = require('mongodb');
const currentDate = new Date();

// Get budget items 
const getBudget = async (req, res) => {
  try {
    // Retrieve the current user's budget records (excluding non-budget items)
    const Items = await budgetItems.find({
      user: req.user._id,
      category: { $nin: ["Saving", "Income", "Debt", "Goals", "Expense"] }
    });

    // Use the current date for comparison and for resetting records
    const currentDateNow = new Date();
    const currentMonth = currentDateNow.getMonth(); // 0 - 11
    const currentYear = currentDateNow.getFullYear();
    const startOfMonth = new Date(currentYear, currentMonth, 1);
    const endOfMonth = new Date(currentYear, currentMonth + 1, 0);

    // Fetch expense items for the current month for this user
    const expenseItems = await expenses.find({
      user: req.user._id,
      date: { 
        $gte: startOfMonth, 
        $lt: endOfMonth     
      }
    });

    // Sum expenses by category (expense.where should match budget record title)
    const categorySums = {
      Living: 0,
      Transportation: 0,
      Healthcare: 0,
      Groceries: 0,
      Restaurant: 0,
      Entertainment: 0,
      Education: 0,
      Gifts: 0,
      Other: 0
    };

    expenseItems.forEach(expense => {
      const key = expense.where;
      const amt = expense.amount;
      if (categorySums.hasOwnProperty(key)) {
        categorySums[key] += amt;
      } else {
        categorySums[key] = amt;
      }
    });

    // Reset outdated budget records (if their recorded date isn't in the current month/year)
    for (let item of Items) {
      const recordDate = new Date(item.date);
      if (recordDate.getMonth() !== currentMonth || recordDate.getFullYear() !== currentYear) {
        // Reset both the target amount and the spent amount to 0
        item.amount = 0;
        item.spent = 0;
        // Update the record's date to the current date so it won't reset again in the same month
        item.date = currentDateNow;
        await item.updateOne({ $set: { amount: 0, spent: 0, date: currentDateNow } });
      }
    }

    // Update each budget record's spent value based on expense sums using the record's title
    for (let item of Items) {
      const budgetTitle = item.title;
      item.spent = categorySums.hasOwnProperty(budgetTitle) ? categorySums[budgetTitle] : 0;
      await item.updateOne({ $set: { spent: item.spent } });
    }

    // Re-fetch the updated budget items from the database
    const updatedItems = await budgetItems.find({
      user: req.user._id,
      category: { $nin: ["Saving", "Income", "Debt", "Goals", "Expense"] }
    });

    // Format budget items for the response
    const formattedBudget = updatedItems.map(Item => ({
      id: Item._id.toString(),
      icon: Item.icon,
      title: Item.title,
      amount: Item.amount,
      spent: Item.spent,
      color: Item.color,
    }));

    // Get saving (goal) items for the current user
    const Goals = await savingItems.find({
      user: req.user._id,
      category: { $nin: ["Saving", "Income", "Debt", "Budget", "Expense"] }
    });

    const formattedGoals = Goals.map(Goal => ({
      id: Goal._id.toString(),
      title: Goal.title,
      startDate: Goal.startDate.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }),
      goalDate: Goal.goalDate.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }),
      currentAmount: Goal.currentAmount,
      goalAmount: Goal.goalAmount,
      category: Goal.category
    }));

    // Get debt items for the current user
    const Debts = await debtItems.find({
      user: req.user._id,
      category: { $nin: ["Saving", "Income", "Budget", "Expense", "Goals"] }
    });

    const formattedDebts = Debts.map(Debt => ({
      id: Debt._id.toString(),
      icon: Debt.icon,
      title: Debt.title,
      currentAmount: Debt.currentAmount,
      color: Debt.color,
      description: Debt.description,
    }));

    return res.status(200).json({
      success: true,
      budgetItems: formattedBudget,
      savingItems: formattedGoals,
      debtItems: formattedDebts
    });
  } catch (error) {
    console.error("Error fetching data:", error);
    return res.status(500).json({ 
      success: false, 
      message: "Server error while fetching data",
      error: error.message 
    });
  }
};



const addGoal = asyncWrapper(async (req, res) => {
    const { title, goalDate, goalAmount } = req.body;
    if (!title || !goalDate || !goalAmount) {
      return res.status(400).json({ success: false, message: "Missing goal fields" });
    }
    const user = req.user._id;
    const newGoal = await savingItems.create({
      category: "Goals",
      title,
      goalDate: new Date(goalDate),
      goalAmount,
      currentAmount: 0,
      user,
      startDate: new Date()
    });
    res.status(201).json({ success: true, goal: newGoal });
  });
  
// Update a budgeting goal
const updateGoal = asyncWrapper(async (req, res) => {
    const goalId = req.params.id;
    const { title, goalDate, goalAmount } = req.body;
    if (!title || !goalDate || !goalAmount) {
      return res.status(400).json({ success: false, message: "Missing goal fields" });
    }
    // Find and update the goal for the authenticated user
    const updatedGoal = await savingItems.findOneAndUpdate(
      { _id: goalId, user: req.user._id },
      {
        title,
        goalDate: new Date(goalDate + "T00:00:00"),
        goalAmount: Number(goalAmount)
      },
      { new: true }
    );
    if (!updatedGoal) {
      return res.status(404).json({ success: false, message: "Goal not found" });
    }
    res.status(200).json({ success: true, goal: updatedGoal });
  });
  
// Delete a budgeting goal
const deleteGoal = asyncWrapper(async (req, res) => {
    const goalId = req.params.id;
    const deletedGoal = await savingItems.findOneAndDelete({ _id: goalId, user: req.user._id });
    if (!deletedGoal) {
      return res.status(404).json({ success: false, message: "Goal not found" });
    }
    res.status(200).json({ success: true, message: "Goal removed" });
  });
  
// NEW: Update a budget item (monthly budget)
const updateBudget = asyncWrapper(async (req, res) => {
  const { amount } = req.body;
  if (amount == null) {
    return res.status(400).json({ success: false, message: "Missing budget amount" });
  }
  // Find the budget item by id and ensure it belongs to the authenticated user
  const updatedBudget = await budgetItems.findOneAndUpdate(
    { _id: req.params.id, user: req.user._id },
    { amount: Number(amount) },
    { new: true }
  );
  if (!updatedBudget) {
    return res.status(404).json({ success: false, message: "Budget item not found" });
  }
  res.status(200).json({ success: true, budget: updatedBudget });
});

const createBudget = asyncWrapper(async (req, res) => {
  const { title, icon, amount, spent, color, category } = req.body;
  if (!title || amount == null || spent == null) {
    return res.status(400).json({ success: false, message: "Missing required budget fields" });
  }
  const user = req.user._id;
  const newBudget = await budgetItems.create({
    title,
    icon, // Note: Depending on your requirements you may want to convert the icon to a string
    amount: Number(amount),
    spent: Number(spent),
    color,
    category,
    user,
    date: new Date()
  });
  res.status(201).json({ success: true, budget: newBudget });
});



module.exports = { getBudget, addGoal, updateGoal, deleteGoal, updateBudget, createBudget };
