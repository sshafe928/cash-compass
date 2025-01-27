require('dotenv').config();
const mongoose = require('mongoose');

const connectDB = () => {
    return mongoose.connect(process.env.MONGOURI,{}).then(() => {console.log('Connected to MongoDB')})
}

module.exports = connectDB;