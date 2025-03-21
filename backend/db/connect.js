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
        
        dbInstance = mongoose.connection;  // We want the Mongoose connection here
        return dbInstance;
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
        throw error;
    }
};



module.exports = { connectDB };
