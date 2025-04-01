const express = require('express');
const router = express.Router();
const { getBudget, addGoal, updateGoal, deleteGoal, updateBudget, createBudget } = require('../controllers/budgetController');
const asyncWrapper = require('../middleware/async');
const authMiddleware = require('../middleware/authMiddleware');

// GET budget items
router.get('/', authMiddleware, asyncWrapper(getBudget));

// POST route for adding a budgeting goal
router.post('/goals', authMiddleware, asyncWrapper(addGoal));

// NEW: POST route for creating a new budget item
router.post('/', authMiddleware, asyncWrapper(createBudget));

// PUT route for updating a budgeting goal
router.put('/goals/:id', authMiddleware, asyncWrapper(updateGoal));

// DELETE route for removing a budgeting goal
router.delete('/goals/:id', authMiddleware, asyncWrapper(deleteGoal));

// PUT route for updating a budget item (monthly budget)
router.put('/:id', authMiddleware, asyncWrapper(updateBudget));

module.exports = router;
