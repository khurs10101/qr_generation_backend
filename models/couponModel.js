const mongoose = require('mongoose')

const Schema = mongoose.Schema

const couponSchema = Schema({

    name: {
        type: String
    },

    value: {
        type: Number,
        default: 0
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