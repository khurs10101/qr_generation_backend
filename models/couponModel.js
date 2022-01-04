const mongoose = require('mongoose')

const Schema = mongoose.Schema

const couponSchema = Schema({
    batchNumber: {
        type: String
    },
    companyName: {
        type: String
    },
    name: {
        type: String
    },

    label: {
        type: String
    },

    value: {
        type: Number,
        default: 0
    },

    couponType: {
        type: String
    },

    userId: {
        type: String
    },

    couponUrl: {
        type: String
    },

    createdOn: {
        type: Date,
        default: Date.now
    },

    isRedeemed: {
        type: Number,
        default: 0
    }

})

module.exports = mongoose.model('Coupon', couponSchema)