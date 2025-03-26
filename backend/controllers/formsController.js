const asyncWrapper = require('../middleware/async');
const Savings = require('../models/Savings');
const savingsItems = require('../models/savingsItems');
const debtItems = require('../models/debtItems');

const getForms = async (req, res) => {
    try {

        // Calculate total savings
        const savings = await Savings.find({ category: "Saving" });//Add user filtering
        const totalSavings = savings.reduce((acc, item) => {
            return item.where === "in" ? acc + item.amount : acc - item.amount;
        }, 0);
        const totalSavingsFormatted = totalSavings.toLocaleString('en-US', { style: 'currency', currency: 'USD' });

        // Fetch and format goals
        const goals = await savingsItems.find({ category: { $nin: ["Saving", "Expense", "Debt", "Budget", "Income"] } });//Add user filtering
        
        const formattedGoals = goals.map(goal => ({
            id: goal._id.toString(),
            title: goal.title,
            goalAmount: goal.goalAmount !== undefined ? goal.goalAmount : 0,
            currentAmount: goal.currentAmount !== undefined ? goal.currentAmount : 0, 
        }));

        // Get debt items
        const Items = await debtItems.find({ category: "Debt" }); //Add user filtering
        const formattedDebtItems = Items.map(item => ({
            id: item._id.toString(),
            title: item.title,
            currentAmount: item.currentAmount,
        }));

        // Send the response with all goals instead of a random one
        res.status(200).json({
            success: true,
            totalSavings: totalSavingsFormatted,
            savingItems: formattedGoals, // Send all goals instead of just a random one
            debtItems: formattedDebtItems,
        });

    } catch (error) {
        console.error("Error occurred in getForms:", error); // Log the error for debugging
        res.status(500).json({ success: false, message: "Something went wrong. Please try again later." });
    }
};

const createIncome = asyncWrapper(async (req, res) => {
    const data = { data } = req.body;
    const user = "user123"; //replace with session user
    
    Income_entry.create({category: data.category, amount: data.amount,  where: data.where, user: user, date: data.date, notes:data.notes})


    try {

        const result = await saveIncome(data); 
        res.status(200).json(result);  
    } catch (error) {
        res.status(500).json({ error: 'Error creating income: ' + error.message });
    }
})

const createExpense = asyncWrapper(async (req, res) => {
    const { type, ...data } = req.body;

    try {

        const result = await saveIncome(data); 
        res.status(200).json(result);  
    } catch (error) {
        res.status(500).json({ error: 'Error creating income: ' + error.message });
    }   
})

const moveDebt = asyncWrapper(async (req, res) => {
    const { type, ...data } = req.body;

    try {

        const result = await saveIncome(data); 
        res.status(200).json(result);  
    } catch (error) {
        res.status(500).json({ error: 'Error creating income: ' + error.message });
    }
})

const moveGoals = asyncWrapper(async (req, res) => {
    const { type, ...data } = req.body;

    try {

        const result = await saveIncome(data); 
        res.status(200).json(result);  
    } catch (error) {
        res.status(500).json({ error: 'Error creating income: ' + error.message });
    }
})

const moveSavings = asyncWrapper(async (req, res) => {
    const { type, ...data } = req.body;

    try {

        const result = await saveIncome(data); 
        res.status(200).json(result);  
    } catch (error) {
        res.status(500).json({ error: 'Error creating income: ' + error.message });
    }
})

module.exports = { getForms, createIncome, createExpense, moveDebt, moveGoals, moveSavings  };
