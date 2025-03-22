const asyncWrapper = require('../middleware/async');
const Expense = require('../models/Expense_entry');
const Income = require('../models/Income_entry');

const getDashboard = async (req, res) => {
    try { 
        // Get transaction data (combined income and expense)
        const expenseData = await Expense.find({
            category: { $nin: ["Saving", "Income", "Debt", "Goals", "Budget"] } // Exclude "savings" category
        }).sort({ date: -1 });
        
        
        const incomeData = await Income.find({
            category: { $nin: ["Saving", "Expense", "Debt", "Goals", "Budget"] } // Exclude "savings" category
        }).sort({ date: -1 });
        
        
        
        // Combine 
        const combinedData = [...expenseData, ...incomeData];
        
        // Sort by date
        combinedData.sort((a, b) => new Date(b.date) - new Date(a.date));
        
        // Limit to 12 transactions
        const transactions = combinedData.slice(0, 12);
        
        // Map to format 
        const formattedTransactions = transactions
            .filter(transaction => {
                // Make sure category is not "savings" and also ensure it’s not null, undefined, or empty string
                return transaction.category && transaction.category.trim() !== "Saving";
            })
            .map(transaction => ({
                id: transaction._id.toString(),
                type: transaction.category === "Income" ? "income" : "expense",
                amount: transaction.amount.toLocaleString('en-US', { style: 'currency', currency: 'USD' }),
                category: transaction.where,
                date: transaction.date.toISOString().split('T')[0],  // Format date to YYYY-MM-DD
            }));

        // Get all income and expense data separately
        const income = await Income.find({ category: { $nin: ["Saving", "Expense", "Debt", "Goals", "Budget"] }});
        const expense = await Expense.find({ category: { $nin: ["Saving", "Income", "Debt", "Goals", "Budget"] }});

        // Map the income and expense data to match the expected format
        const formattedIncome = income.map(transaction => ({
            id: transaction._id.toString(),
            type: transaction.category,
            amount: transaction.amount,
            category: transaction.where,
            date: transaction.date.toISOString().split('T')[0],  // Format date to YYYY-MM-DD
        }));

        const formattedExpense = expense.map(transaction => ({
            id: transaction._id.toString(),
            type: transaction.category,
            category: transaction.where,
            amount: transaction.amount,
            date: transaction.date.toISOString().split('T')[0],  // Format date to YYYY-MM-DD
        }));

        // Send the response with formatted data
        res.status(200).json({
            success: true,
            transactions: formattedTransactions,
            income: formattedIncome,
            expense: formattedExpense
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = { getDashboard };
