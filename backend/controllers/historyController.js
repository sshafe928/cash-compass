const asyncWrapper = require('../middleware/async');

const getHistory = async (req, res) => {
    try {
        
        const data = await db.transactions.find()
        
        
        res.status(200).json({ success: true, transactions: data});
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = { getHistory };