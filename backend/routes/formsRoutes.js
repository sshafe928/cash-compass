const express = require('express');
const router = express.Router();
const { getForms, createIncome, createExpense, moveDebt, moveGoals, moveSavings } = require('../controllers/formsController');

router.get('/', getForms);

router.post('/api/forms', (req, res) => {
    const { type, ...data } = req.body;

    if (type === 'income') {
        createIncome
    } else if (type === 'expense') {
        createExpense
    } else if (type === 'savings') {
        moveSavings
    } else if (type === 'debt') {
        moveDebt
    } else if (type === 'goals') {
        moveGoals
    } else {
        res.status(400).send({ error: 'Invalid form type' });
    }
});


module.exports = router;