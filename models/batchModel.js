const mongoose = require('mongoose')
const Schema = mongoose.Schema

const batchSchema = Schema({
    batchNumber: {
        type: String
    },
    companyName: {
        type: String
    },
    name: {
        type: String
    },
    couponType: {
        type: String
    }
})

module.exports = mongoose.model('BatchNumber', batchSchema)