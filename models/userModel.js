const mongoose = require('mongoose')

const Schema = mongoose.Schema

const userSchema = Schema({
    name: {
        type: String,
    },
    phone: {
        type: String
    },
    bankName: {
        type: String
    },
    bankAccountNumber: {
        type: String
    },
    bankIfscCode: {
        type: String
    },
    password: {
        type: String
    },
    city: {
        type: String
    },
    states: {
        type: String
    },
    collectedPoints: {
        type: Number,
        default: 0
    },
    redeemedPoints: {
        type: Number,
        default: 0
    },
    isActive: {
        type: Number,
        default: 1
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
})

module.exports = mongoose.model('User', userSchema)