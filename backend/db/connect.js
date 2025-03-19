require('dotenv').config();
const mongoose = require('mongoose');

let dbInstance = null;

const connectDB = async () => {
    if (dbInstance) return dbInstance;  

    try {
        await mongoose.connect(process.env.MONGOURI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('Connected to MongoDB');
        
        dbInstance = mongoose.connection.db;  
        return dbInstance;
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
        throw error;
    }
};

const getDB = async () => {
    if (!dbInstance) {
        dbInstance = await connectDB();  
    }
    return dbInstance;
};

module.exports = { getDB, connectDB };