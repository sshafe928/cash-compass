const express = require('express');
const router = express.Router();
const {
  getForms,
  createIncome,
  createExpense,
  moveDebt,
  moveGoals,
  moveSavings
} = require('../controllers/formsController');

router.get('/', getForms);

router.post('/', (req, res) => {
  const { type } = req.body;
  if (type === 'income') {
    createIncome(req, res);
  } else if (type === 'expense') {
    createExpense(req, res);
  } else if (type === 'savings') {
    // Check the nested data's category
    if (req.body.data.category === "Goals") {
      moveGoals(req, res);
    } else {
      moveSavings(req, res);
    }
  } else if (type === 'debt') {
    moveDebt(req, res);
  } else if (type === 'goals') {
    moveGoals(req, res);
  } else {
    res.status(400).send({ error: 'Invalid form type' });
  }
});

module.exports = router;
