const asyncWrapper = require('../middleware/async');
const budgetItems = require("../models/budgetItems")
const { ObjectId } = require('mongodb'); 


// Get budget items 
const getBudget = async (req, res) => {
    try { 
        // Get transaction data (combined income and expense)
        const Items = await budgetItems.find({})
        

        // Map to format 
        const formattedBudget = Items
            .map(Items => ({
                id: Item._id.toString(),
                type: Item.category,
                amount: Item.amount,
                category: Item.where,
                date: Item.date.toISOString().split('T')[0],  // Format date to YYYY-MM-DD
            }));


        // Send the response with formatted data
        res.status(200).json({
            success: true,
            transactions: formattedBudget
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// New function to update budget
const updateBudget = asyncWrapper(async (req, res) => {
    const { id, newAmount } = req.body;
    
    // Validate input
    if (!id || !newAmount || isNaN(parseFloat(newAmount))) {
        return res.status(400).json({ 
            success: false, 
            message: 'Please provide valid id and newAmount'
        });
    }
    
    try {
        const db = getDB();
        
        // Convert string to number and ensure 2 decimal places
        const formattedAmount = parseFloat(parseFloat(newAmount).toFixed(2));
        
        // Update the budget document
        const result = await db.transactions.updateOne(
            { _id: new ObjectId(id) },
            { $set: { amount: formattedAmount } }
        );
        
        // Check if document was found and updated
        if (result.matchedCount === 0) {
            return res.status(404).json({ 
                success: false, 
                message: 'Budget category not found'
            });
        }
        
        // Return success response
        return res.status(200).json({ 
            success: true, 
            message: 'Budget updated successfully',
            updatedAmount: formattedAmount
        });
    } catch (error) {
        console.error('Error updating budget:', error);
        return res.status(500).json({ 
            success: false, 
            message: 'Server error while updating budget',
            error: error.message 
        });
    }
});

module.exports = { getBudget, updateBudget };