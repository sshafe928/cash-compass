const mongoose = require('mongoose');

const GoalSchema = new mongoose.Schema({
    category:{
        type: String,
        required: true,
        default: 'Goals'  
    },
    
    title:{
        type: String,
        required: true,
        trim: true,
        default: ''
    },
    user: {
        type: String,
        required: true
    },
    startDate: {
        type: Date,
        default: Date.now,
        required: true
    },
    goalDate: {
        type: Date,
        default: Date.now,
        required: true
    },
    goalAmount: {
        type: Number,
        trim: true,
        required: true
    },
    currentAmount: {
        type: Number,
        trim: true,
        required: true
    },


}, {collection: 'transactions'})

module.exports = mongoose.model('Goals', GoalSchema);