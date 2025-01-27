const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: [true, 'Must provide Full name'],
        trim: true,
    },
    email: {
        type: String,
        required: [true, 'Must provide Email'],
        trim: true,
        unique: true,
    },
    password: {
        type: String,
        required: [true, 'Must provide Password'],
        trim: true,
    },
    userMoney: {
        type: Number,
        required: [true]
    }
    
    
}, {collection: 'users'})

module.exports = mongoose.model('User', UserSchema);