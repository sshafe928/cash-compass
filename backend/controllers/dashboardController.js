const asyncWrapper = require('../middleware/async');
const Expense = require('../models/Expense_entry');
const Income = require('../models/Income_entry');
const Savings = require('../models/Savings');
const budgetItems = require('../models/budgetItems');
const savingsItems = require('../models/savingsItems');

const getDashboard = async (req, res) => {
    try {
        // Get transaction data (combined income and expense)
        const expenseData = await Expense.find({
            category: { $nin: ["Saving", "Income", "Debt", "Goals", "Budget"] }
        }).sort({ date: -1 });

        const incomeData = await Income.find({
            category: { $nin: ["Saving", "Expense", "Debt", "Goals", "Budget"] }
        }).sort({ date: -1 });

        // Combine income and expense data and sort by date
        const combinedData = [...expenseData, ...incomeData].sort((a, b) => new Date(b.date) - new Date(a.date));

        // Limit to 12 transactions and filter out unwanted categories
        const transactions = combinedData.slice(0, 12).map(transaction => ({
            id: transaction._id.toString(),
            type: transaction.category === "Income" ? "income" : "expense",
            amount: transaction.amount.toLocaleString('en-US', { style: 'currency', currency: 'USD' }),
            category: transaction.where,
            date: transaction.date.toISOString().split('T')[0],  // Format date to YYYY-MM-DD
        })).filter(transaction => transaction.category && transaction.category.trim() !== "Saving");

        // Get all income and expense data separately
        const formattedIncome = await Income.find({ category: { $nin: ["Saving", "Expense", "Debt", "Goals", "Budget"] } })
            .then(income => income.map(transaction => ({
                id: transaction._id.toString(),
                type: transaction.category,
                amount: transaction.amount,
                category: transaction.where,
                date: transaction.date.toISOString().split('T')[0],
            })));

        const formattedExpense = await Expense.find({ category: { $nin: ["Saving", "Income", "Debt", "Goals", "Budget"] } })
            .then(expense => expense.map(transaction => ({
                id: transaction._id.toString(),
                type: transaction.category,
                category: transaction.where,
                amount: transaction.amount,
                date: transaction.date.toISOString().split('T')[0],
            })));

        // Calculate total balance
        const totalAmount = incomeData.reduce((acc, item) => acc + item.amount, 0) - 
                            expenseData.reduce((acc, item) => acc + item.amount, 0);
        const totalAmountFormatted = totalAmount.toLocaleString('en-US', { style: 'currency', currency: 'USD' });

        // Calculate total savings
        const savings = await Savings.find({ category: "Saving" });
        const totalSavings = savings.reduce((acc, item) => {
            return item.where === "in" ? acc + item.amount : acc - item.amount;
        }, 0);
        const totalSavingsFormatted = totalSavings.toLocaleString('en-US', { style: 'currency', currency: 'USD' });

        // Calculate total budget
        const budget = await budgetItems.find({ category: "Budget" });
        const totalBudget = budget.reduce((acc, item) => acc + item.amount, 0);
        const totalBudgetFormatted = totalBudget.toLocaleString('en-US', { style: 'currency', currency: 'USD' });

        // Fetch and format goals
        const goals = await savingsItems.find({ category: { $nin: ["Saving", "Expense", "Debt", "Budget", "Income"] } });
        
        const formattedGoals = goals.map(goal => ({
            id: goal._id.toString(),
            title: goal.title,
            goalAmount: goal.goalAmount !== undefined ? goal.goalAmount : 0,
            currentAmount: goal.currentAmount !== undefined ? goal.currentAmount : 0, 
        }));
        
        const displayedGoal = formattedGoals[Math.floor(Math.random() * formattedGoals.length)];

        // Send the response
        res.status(200).json({
            success: true,
            transactions,
            income: formattedIncome,
            expense: formattedExpense,
            totalAmount: totalAmountFormatted,
            totalSavings: totalSavingsFormatted,
            totalBudget: totalBudgetFormatted,
            displayedGoal: displayedGoal,
        });

    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = { getDashboard };
