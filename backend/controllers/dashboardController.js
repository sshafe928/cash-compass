const asyncWrapper = require('../middleware/async');
const Expense = require('../models/Expense_entry');
const Income = require('../models/Income_entry');
const Savings = require('../models/Savings');
const budgetItems = require('../models/budgetItems');
const savingsItems = require('../models/savingsItems');
const debtItems = require('../models/debtItems'); // Make sure this model exists

// Helper to aggregate monthly totals for a given model and field
const getMonthlyTotals = async (Model, userId, field = "amount") => {
    const currentYear = new Date().getFullYear();
    // Use the model’s name to filter documents
    const expectedCategory = Model.modelName; // "Income", "Expense", or "Debt"
    const results = await Model.aggregate([
      {
        $match: {
          user: userId,
          category: expectedCategory,
          date: {
            $gte: new Date(currentYear, 0, 1),
            $lt: new Date(currentYear + 1, 0, 1)
          }
        }
      },
      {
        $group: {
          _id: { $month: "$date" },
          total: { $sum: `$${field}` }
        }
      },
      { $sort: { _id: 1 } }
    ]);
    const totals = Array(12).fill(0);
    results.forEach(item => {
      totals[item._id - 1] = item.total;
    });
    return totals;
  };
  

const getDashboard = async (req, res) => {
  try {
    // Get the authenticated user's ID (set by auth middleware)
    const userId = req.user.id;

    // Fetch expense and income data for the user (excluding certain categories)
    const expenseData = await Expense.find({
      user: userId,
      category: { $nin: ["Saving", "Income", "Debt", "Goals", "Budget"] }
    }).sort({ date: -1 });

    const incomeData = await Income.find({
      user: userId,
      category: { $nin: ["Saving", "Expense", "Debt", "Goals", "Budget"] }
    }).sort({ date: -1 });

    // Combine and sort transactions by date (most recent first)
    const combinedData = [...expenseData, ...incomeData].sort(
      (a, b) => new Date(b.date) - new Date(a.date)
    );

    const transactions = combinedData
      .slice(0, 12)
      .map(transaction => ({
        id: transaction._id.toString(),
        type: transaction.category === "Income" ? "income" : "expense",
        amount: transaction.amount.toLocaleString('en-US', {
          style: 'currency',
          currency: 'USD'
        }),
        category: transaction.where,
        date: transaction.date.toISOString().split('T')[0]
      }))
      .filter(transaction => transaction.category && transaction.category.trim() !== "Saving");

    // Format income and expense arrays for detailed views
    const formattedIncome = (await Income.find({
      user: userId,
      category: { $nin: ["Saving", "Expense", "Debt", "Goals", "Budget"] }
    })).map(transaction => ({
      id: transaction._id.toString(),
      type: transaction.category,
      amount: transaction.amount,
      category: transaction.where,
      date: transaction.date.toISOString().split('T')[0]
    }));

    const formattedExpense = (await Expense.find({
      user: userId,
      category: { $nin: ["Saving", "Income", "Debt", "Goals", "Budget"] }
    })).map(transaction => ({
      id: transaction._id.toString(),
      type: transaction.category,
      category: transaction.where,
      amount: transaction.amount,
      date: transaction.date.toISOString().split('T')[0]
    }));

    // Calculate total balance: income minus expense
    const totalIncomeAmount = incomeData.reduce((acc, item) => acc + item.amount, 0);
    const totalExpenseAmount = expenseData.reduce((acc, item) => acc + item.amount, 0);
    const totalAmount = totalIncomeAmount - totalExpenseAmount;
    const totalAmountFormatted = totalAmount.toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD'
    });

    // Calculate total savings from the Savings collection
    const savingsData = await Savings.find({
      user: userId,
      category: "Saving"
    });
    const totalSavings = savingsData.reduce((acc, item) => {
      // Assuming "where" indicates money added ("in") vs. removed ("out")
      return item.where === "in" ? acc + item.amount : acc - item.amount;
    }, 0);
    const totalSavingsFormatted = totalSavings.toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD'
    });

    // Calculate total budget from the budgetItems collection
    const budget = await budgetItems.find({
      user: userId,
      category: "Budget"
    });
    const totalBudget = budget.reduce((acc, item) => acc + item.amount, 0);
    const totalBudgetFormatted = totalBudget.toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD'
    });

    // Fetch and format goals from the savingsItems collection
    const goals = await savingsItems.find({
      user: userId,
      category: { $nin: ["Saving", "Expense", "Debt", "Budget", "Income"] }
    });
    const formattedGoals = goals.map(goal => ({
      id: goal._id.toString(),
      title: goal.title,
      goalAmount: goal.goalAmount || 0,
      currentAmount: goal.currentAmount || 0
    }));
    const displayedGoal = formattedGoals[Math.floor(Math.random() * formattedGoals.length)] || {};

    // Aggregate monthly totals for the graph using our helper
    const monthlyIncome = await getMonthlyTotals(Income, userId); // Sums "amount"
    const monthlyExpense = await getMonthlyTotals(Expense, userId); // Sums "amount"
    // For debt, sum the "currentAmount" field from debtItems
    const monthlyDebt = await getMonthlyTotals(debtItems, userId, "currentAmount");

    // Send the response with all dashboard data
    res.status(200).json({
      success: true,
      transactions,
      income: formattedIncome,
      expense: formattedExpense,
      totalAmount: totalAmountFormatted,
      totalSavings: totalSavingsFormatted,
      totalBudget: totalBudgetFormatted,
      displayedGoal: displayedGoal,
      chartIncome: monthlyIncome,
      chartExpense: monthlyExpense,
      chartDebt: monthlyDebt
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getDashboard };
