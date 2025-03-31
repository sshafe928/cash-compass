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
    // Filter budget items to only include those for the current user
    const Items = await budgetItems.find({
      user: req.user._id,
      category: { $nin: ["Saving", "Income", "Debt", "Goals", "Expense"] }
    });

    // Get the current month and year
    const currentMonth = currentDate.getMonth(); // 0 - 11
    const currentYear = currentDate.getFullYear();
    const startOfMonth = new Date(currentYear, currentMonth, 1);
    const endOfMonth = new Date(currentYear, currentMonth + 1, 0);

    // Filter expense items for the current user and current month
    const expenseItems = await expenses.find({
      user: req.user._id,
      date: { 
        $gte: startOfMonth, 
        $lt: endOfMonth     
      }
    });

    // Initialize an object to sum expenses by category
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
      const category = expense.where;
      const amount = expense.amount;
      if (categorySums.hasOwnProperty(category)) {
        categorySums[category] += amount;
      } else {
        categorySums[category] = amount;
      }
    });

    for (let item of Items) {
      const category = item.category;
      item.spent = categorySums.hasOwnProperty(category) ? categorySums[category] : 0;
      await item.updateOne({ $set: { spent: item.spent } });
    }
    
    // Format budget items
    const formattedBudget = Items.map(Item => ({
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
      startDate: Goal.startDate.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
      goalDate: Goal.goalDate.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
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
    console.error('Error fetching data:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'Server error while fetching data',
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
  


  module.exports = { getBudget, addGoal, updateGoal, deleteGoal };
