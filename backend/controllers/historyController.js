const asyncWrapper = require('../middleware/async');
const Expense = require('../models/Expense_entry');
const Income = require('../models/Income_entry');
const Debt = require('../models/debtItems')
const Saving = require('../models/Savings')


const getHistory = async (req, res) => {
    try {
        // Get the logged in user's ID
        const userId = req.user.id;

        // Filter each query by the userId in addition to your existing filters
        const expenseData = await Expense.find({
            user: userId,
            category: { $nin: ["Saving", "Income", "Debt", "Goals", "Budget"] }
        });
        const incomeData = await Income.find({
            user: userId,
            category: { $nin: ["Saving", "Expense", "Debt", "Goals", "Budget"] }
        });
        const savingData = await Saving.find({
            user: userId,
            category: { $nin: ["Expense", "Income", "Debt", "Goals", "Budget"] }
        });

        const combinedData = [...expenseData, ...incomeData, ...savingData];

        // Sort by date (most recent first)
        const transactions = combinedData.sort((a, b) => new Date(b.date) - new Date(a.date));

        // Map the transactions for formatting purposes
        const formattedTransactions = transactions.map(transaction => ({
            id: transaction._id.toString(),
            type: transaction.category,
            amount: transaction.amount, // raw amount (for comparisons)
            formattedAmount: transaction.amount.toLocaleString('en-US', { style: 'currency', currency: 'USD' }),
            category: transaction.where,
            date: transaction.date.toISOString().split('T')[0],
            description: transaction.notes
        }));

        res.status(200).json({ success: true, transactions: formattedTransactions });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};


module.exports = { getHistory };