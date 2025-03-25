const express = require('express');
const router = express.Router();
const { getForms } = require('../controllers/formsController');

router.get('/', getForms);

router.post('/api/forms', (req, res) => {
    const { type, ...data } = req.body;

    if (type === 'income') {
        // Process income data
    } else if (type === 'expense') {
        // Process expense data
    } else if (type === 'savings') {
        // Process savings data
    } else if (type === 'debt') {
        // Process debt data
    } else {
        res.status(400).send({ error: 'Invalid form type' });
    }
});


module.exports = router;