const mongoose = require('mongoose')

const Schema = mongoose.Schema

const couponTypeSchema = Schema({
    ctype: {
        type: String
    }
})

const inventorySchema = Schema({
    companyName: {
        type: String
    },
    serial: {
        type: String
    },
    description: {
        type: String,
    },
    couponTags: [String],
    createdOn: {
        type: Date,
        default: Date.now
    }
})

module.exports = mongoose.model('Inventory', inventorySchema)
