const asyncWrapper = require('../middleware/async');

const getDashboard = async (req, res) => {
    try {
        const data = await db.transactions.find({
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
        
        res.status(200).json({ success: true, transactions: data, budgetItems: budgetItems, savingItems: savingItems});
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = { getDashboard };