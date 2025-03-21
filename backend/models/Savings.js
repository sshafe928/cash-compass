const mongoose = require('mongoose');

const SavingSchema = new mongoose.Schema({
    category:{
        type: String,
        required: true,
        default: 'Saving'  
    },
    amount: {
        type: Number,
        trim: true,
        required: true
    },
    where:{
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

    notes:{
        type: String,
        trim: true,
        required: false,
        default: ''
    }
}, {collection: 'transactions'})

module.exports = mongoose.model('Saving', SavingSchema);