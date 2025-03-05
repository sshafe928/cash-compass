const Saving = require('../models/Savings_entry');
const Debt = require('../models/Debt_entry');
const Expense = require('../models/Expense_entry');
const Income = require('../models/Income_entry');
const asyncWrapper = require('../middleware/async');

const getDashboard = asyncWrapper(async (req, res) => {
    currentUser = req.session.email;
    console.log(req.session.email);
    
    const transactions = await db.transactions.find({
        "category": { $in: ["Expense", "Income"] }
    })
    .sort({ "date": -1 })  // Sort by date in descending order 
    .limit(12); //12 limit

    const savingItems = await db.transactions.find({
        "category": { $in: ["Goals"] }
    });

    const budgetItems = await db.transactions.find({
        "category": { $in: ["Budget"] }
    })
    

    res.render('App', { transactions, savingItems, budgetItems });
});