const mongoose = require('mongoose')

const Schema = mongoose.Schema

const companySchema = ({
    name: {
        type: String
    }
})

module.exports = mongoose.model('Company', companySchema)