const mongoose = require('mongoose');

const BudgetSchema = new mongoose.Schema({
    category:{
        type: String,
        required: true,
        default: 'Budget'  
    },
    title:{
        type: String,
        required: true,
        trim: true,
        default: ''
    },
    icon:{
        type : Object,
    },
    amount: {
        type: Number,
        trim: true,
        required: true
    },
    spent: {
        type: Number,
        trim: true,
        required: true
    },
    
    user: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now,
        required: true
    },
    color:{
        type: String,
        required: true,
        default: '#FF0000'
    },

}, {collection: 'transactions'})

module.exports = mongoose.model('Budget', BudgetSchema);