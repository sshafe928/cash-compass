const asyncWrapper = require('../middleware/async');
const { getDB } = require('./connect'); 


const getBudget = async (req, res) => {
    try {
        
        const db = getDB();
        const savingItems = await db.transactions.find({
            "category": { $in: ["Goals"] }
        });

        const budgetItems = await db.transactions.find({
            "category": { $in: ["Budget"] }
        })
        
        const debtItems = await db.transactions.find({
            "category": { $in: ["Debt"] }
        })
        
        res.status(200).json({ success: true, savingItems: savingItems, budgetItems: budgetItems, debtItems: debtItems});
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = { getBudget };