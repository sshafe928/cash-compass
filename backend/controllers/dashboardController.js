const asyncWrapper = require('../middleware/async');

const getDashboard = async (req, res) => {
    try {
        const data = await db.transactions.find({
            "category": { $in: ["Expense", "Income"] }
        })
        .sort({ "date": -1 })  // Sort by date in descending order 
        .limit(12); //12 limit

        const income = await db.transactions.find({
            'category': { $in: ["Income"] }
        })

        const expense = await db.transactions.find({
            'category': { $in: ["Expense"] }
        })
        
        
        res.status(200).json({ success: true, transactions: data, income: income, expense: expense});
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = { getDashboard };