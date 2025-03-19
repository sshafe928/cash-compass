const asyncWrapper = require('../middleware/async');
const { getDB } = require('./connect'); 

//Creating and income
const createIncome = async (req, res) => {
    try {
        const { title, description, location } = req.body;
        
        if (!title || !description) {
            return res.status(400).json({ message: 'Title and description are required' });
        }

        const newNews = new News({
            title,
            description,
            location,
        });

        await newNews.save();
        return res.status(201).json({ message: 'News created successfully', news: newNews });
    } catch (error) {
        console.error('Error creating news:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};


// Creating and expense
const createExpense = async (req, res) => {
    try {
        const { title, description, location } = req.body;
        
        if (!title || !description) {
            return res.status(400).json({ message: 'Title and description are required' });
        }

        const newNews = new News({
            title,
            description,
            location,
        });

        await newNews.save();
        return res.status(201).json({ message: 'News created successfully', news: newNews });
    } catch (error) {
        console.error('Error creating news:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

const createSaving = async (req, res) => {
    try {
        const { title, description, location } = req.body;
        
        if (!title || !description) {
            return res.status(400).json({ message: 'Title and description are required' });
        }

        const newNews = new News({
            title,
            description,
            location,
        });

        await newNews.save();
        return res.status(201).json({ message: 'News created successfully', news: newNews });
    } catch (error) {
        console.error('Error creating news:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};