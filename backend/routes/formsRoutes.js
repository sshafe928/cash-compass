const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const {
  getForms,
  createIncome,
  createExpense,
  moveDebt,
  moveSavings,
  moveGoals
} = require('../controllers/formsController');

router.get('/', authMiddleware, getForms);

router.post('/', authMiddleware, (req, res) => {
  const { type } = req.body;
  if (type === 'income') {
    createIncome(req, res);
  } else if (type === 'expense') {
    createExpense(req, res);
  } else if (type === 'savings') {
    // Depending on the nested data's category field, either update a goal or create a direct saving record
    if (req.body.data.category === "Goals") {
      moveGoals(req, res);
    } else {
      moveSavings(req, res);
    }
  } else if (type === 'debt') {
    moveDebt(req, res);
  } else {
    res.status(400).send({ error: 'Invalid form type' });
  }
});

module.exports = router;
