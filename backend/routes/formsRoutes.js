const express = require('express');
const router = express.Router();
const { getForms, createIncome, createExpense, moveDebt, moveGoals, moveSavings } = require('../controllers/formsController');

router.get('/', getForms);

router.post('/api/forms', (req, res) => {
    const { type, data } = req.body;

    if (type === 'income') {
        createIncome(data) 
            .then(response => res.status(200).send(response)) 
            .catch(error => res.status(500).send({ error: error.message })); 

    } else if (type === 'expense') {
        createExpense(data)
            .then(response => res.status(200).send(response))
            .catch(error => res.status(500).send({ error: error.message }));

    } else if (type === 'savings') {
        if (data.category === "Goals"){
            moveGoals(data)
            .then(response => res.status(200).send(response))
            .catch(error => res.status(500).send({ error: error.message }));
        }else{
            moveSavings(data)
            .then(response => res.status(200).send(response))
            .catch(error => res.status(500).send({ error: error.message }))
        }

    } else if (type === 'debt') {
        moveDebt(data)
            .then(response => res.status(200).send(response))
            .catch(error => res.status(500).send({ error: error.message }));

    } else if (type === 'goals') {
        moveGoals(data)
            .then(response => res.status(200).send(response))
            .catch(error => res.status(500).send({ error: error.message }));

    } else {
        res.status(400).send({ error: 'Invalid form type' });
    }
});

module.exports = router;
