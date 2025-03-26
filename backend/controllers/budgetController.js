const asyncWrapper = require('../middleware/async');
const budgetItems = require("../models/budgetItems");
const savingItems = require("../models/savingsItems");
const debtItems = require("../models/debtItems");
const expenses = require('../models/Expense_entry');
const { ObjectId } = require('mongodb');
const currentDate = new Date();

// Get budget items 
const getBudget = async (req, res) => {
    try {
        // Get budget items (excluding certain categories)
        const Items = await budgetItems.find({
            category: { $nin: ["Saving", "Income", "Debt", "Goals", "Expense"] }//Add user filtering
        });

        // Get the current month and year
        const currentMonth = currentDate.getMonth(); // 0 - 11 (January - December)
        const currentYear = currentDate.getFullYear(); // e.g., 2025

        // Get the start and end of the current month
        const startOfMonth = new Date(currentYear, currentMonth, 1);  // Start of the current month
        const endOfMonth = new Date(currentYear, currentMonth + 1, 0); // End of the current month

        // Query the database for expenses that occurred in the current month
        const expenseItems = await expenses.find({
            date: { 
                $gte: startOfMonth, 
                $lt: endOfMonth     
            }
        });

        // Initialize an object to hold the summed expenses for each category
        const categorySums = {
            Living: 0,
            Transportation: 0,
            Healthcare: 0,
            Groceries: 0,
            Restaurant: 0,
            Entertainment: 0,
            Education: 0,
            Gifts: 0,
            Other: 0
        };

        //Add user filtering
        expenseItems.forEach(expense => {
            const category = expense.where; // Get the category (Living, Transportation, etc.)
            const amount = expense.amount;  // Get the amount for the expense

            // Add the amount to the correct category
            if (categorySums.hasOwnProperty(category)) {
                categorySums[category] += amount;
            } else {
                categorySums[category] = amount;  // If a new category is found (optional)
            }
        });

        for (let item of Items) {
            const category = item.category;
            item.spent = categorySums.hasOwnProperty(category) ? categorySums[category] : 0;
            await item.updateOne({ $set: { spent: item.spent } });
        }
        
        

        // Map to format budget items
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
            category: { $nin: ["Saving", "Income", "Debt", "Budget", "Expense"] }//Add user filtering
        });

        // Map to format goals
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
            category: { $nin: ["Saving", "Income", "Budget", "Expense", "Goals"] }//Add user filtering
        });

        // Map to format debt items
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

module.exports = { getBudget };
