const asyncWrapper = require('../middleware/async');
const Expense = require('../models/Expense_entry');
const Income = require('../models/Income_entry');
const Debt = require('../models/debtItems')
const Saving = require('../models/Savings')

const getHistory = async (req, res) => {
    try {
        const expenseData = await Expense.find({});
        const debtData = await Debt.find({});
        const incomeData = await Income.find({});
        const savingData = await Saving.find({});

        const combinedData = [...expenseData, ...incomeData, ...savingData, ...debtData];

        // Sort by date
        const transactions = combinedData.sort((a, b) => new Date(b.date) - new Date(a.date));

        // Map to format data and send both formatted and raw amounts
        const formattedTransactions = transactions.map(transaction => ({
            id: transaction._id.toString(),
            type: transaction.category,
            amount: transaction.amount, // raw amount (for comparison)
            formattedAmount: transaction.amount.toLocaleString('en-US', { style: 'currency', currency: 'USD' }), // formatted currency string
            category: transaction.where,
            date: transaction.date.toISOString().split('T')[0],  // Format date to YYYY-MM-DD
            description: transaction.notes
        }));

        res.status(200).json({ success: true, transactions: formattedTransactions });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};


module.exports = { getHistory };