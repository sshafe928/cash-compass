const asyncWrapper = require('../middleware/async');
const budgetItems = require("../models/budgetItems");
const savingItems = require("../models/savingsItems");  
const debtItems = require("../models/debtItems");
const { ObjectId } = require('mongodb');

// Get budget items 
const getBudget = async (req, res) => {
    try { 

        

        
        // Get budget items
        const Items = await budgetItems.find({
            category: { $nin: ["Saving", "Income", "Debt", "Goals", "Expense"] }
        });

        // Map to format 
        const formattedBudget = Items.map(Item => ({
            id: Item._id.toString(),
            icon: Item.icon,
            title: Item.title,
            amount: Item.amount,
            spent: Item.spent,
            color: Item.color,
        }));

        // Get saving items
        const Goals = await savingItems.find({
            category: { $nin: ["Saving", "Income", "Debt", "Budget", "Expense"] }
        });

        // Map to format
        const formattedGoals = Goals.map(Goal => ({
            id: Goal._id.toString(),
            title: Goal.title,
            startDate: Goal.startDate.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric'}),
            goalDate: Goal.goalDate.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric'}),
            currentAmount: Goal.currentAmount,
            goalAmount: Goal.goalAmount,
            category: Goal.category
        }));

        // Get debt items
        const Debts = await debtItems.find({
            category: { $nin: ["Saving", "Income", "Budget", "Expense", "Goals"] }
        });

        // Map to format
        const formattedDebts = Debts.map(Debt => ({
            id: Debt._id.toString(),
            icon: Debt.icon,
            title: Debt.title,
            currentAmount: Debt.currentAmount,
            color: Debt.color,
            description: Debt.description,
        }));

        // Send the response with formatted data
        return res.status(200).json({
            success: true,
            budgetItems: formattedBudget,
            savingItems: formattedGoals,
            debtItems: formattedDebts
        });
    } catch (error) {
        console.error('Error fetching data:', error);
        return res.status(500).json({ 
            success: false, 
            message: 'Server error while fetching data',
            error: error.message 
        });
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