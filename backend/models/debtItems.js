const mongoose = require('mongoose');

const DebtSchema = new mongoose.Schema({
    category:{
        type: String,
        required: true,
        default: 'Debt'  
    },
    icon:{
        type : Object,
    },
    currentAmount: {
        type: Number,
        trim: true,
        required: true
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

    description:{
        type: String,
        trim: true,
        required: false,
        default: ''
    },
    notes:{
        type: String,
        required: true,
        default: ''
    }
}, {collection: 'transactions'})

module.exports = mongoose.model('Debt', DebtSchema);