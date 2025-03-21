const asyncWrapper = require('../middleware/async');
const Expense = require('../models/Expense_entry');
const Income = require('../models/Income_entry');
const Debt = require('../models/debtItems')
const Saving = require('../models/Savings')

const getHistory = async (req, res) => {
    try {
        
        // Get transaction data (combined income and expense)
                const expenseData = await Expense.find({})
                const debtData = await Debt.find({})
                const incomeData = await Income.find({})
                const savingData = await Saving.find({})
        
        
                // Combine 
                const combinedData = [...expenseData, ...incomeData, ...savingData, ...debtData];
        
                // Sort by date
                const transactions = combinedData.sort((a, b) => new Date(b.date) - new Date(a.date));
        
                
                
        
                // Map to format 
                const formattedTransactions = transactions
                    .map(transaction => ({
                        id: transaction._id.toString(),
                        type: transaction.category,
                        amount: transaction.amount.toLocaleString('en-US', {style: 'currency', currency: 'USD' }),
                        category: transaction.where,
                        date: transaction.date.toISOString().split('T')[0],  // Format date to YYYY-MM-DD
                        description: transaction.notes
                    }));
        
        
        
        res.status(200).json({ success: true, transactions: formattedTransactions});
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = { getHistory };