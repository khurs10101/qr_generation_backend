const { toLower, isEmpty, isNull } = require('lodash')
const Company = require('../models/companyModel')
const Inventory = require('../models/inventoryModel')

module.exports.saveOrUpdateInventory = async (req, res, next) => {
    let responseCode = 401
    let message = ""
    const { inventoryList } = req.body
    const inventoryObjectList = []
    let count = 0
    try {

        for (let inventory1 of inventoryList) {
            let inventory = await Inventory.findOne({
                companyName: inventory1.companyName,
                serial: inventory1.serial,
                description: inventory1.description
            })

            if (isEmpty(inventory)) {
                let inventoryObj = new Inventory({
                    companyName: inventory1.companyName,
                    serial: inventory1.serial,
                    description: inventory1.description
                })

                for (let tags of inventory1.couponTags) {
                    inventoryObj.couponTags.push(tags)
                }

                inventoryObj = await inventoryObj.save()
                inventoryObjectList.push(inventoryObj)

                count = count + 1
            }
        }

        res.status(201).json({
            message: "Inventory updated",
            added: count,
            inventories: inventoryObjectList
        })
        return
    } catch (e) {
        console.error(e)
        responseCode = 500
        message = "Internal server error"
    }
    res.status(responseCode).json({
        message,
        errors: {
            message
        }
    })
}

module.exports.getAllCompanies = async (req, res, next) => {
    let responseCode = 401
    let message = ""
    try {
        let companies = await Company.find({})
        res.status(200).json({
            companies
        })
        return
    } catch (e) {
        console.error(e)
        responseCode = 500
        message = "Internal server error"
    }

    res.status(responseCode).json({
        message,
        errors: {
            message
        }
    })
}


module.exports.saveCompanyDetails = async (req, res, next) => {
    let responseCode = 401
    let message = ""
    let { companyName } = req.body
    companyName = toLower(companyName)
    try {
        let company = await Company.findOne({
            name: companyName
        })
        if (isEmpty(company)) {
            company = new Company({
                name: companyName
            })

            company = await company.save()
            responseCode = 201
        } else {
            responseCode = 200
        }

        res.status(responseCode).json({
            company
        })
        return
    } catch (e) {

        console.error(e)
        responseCode = 500
        message = "Internal server error"
    }
    res.status(responseCode).json({
        message,
        errors: {
            message
        }
    })
}

module.deleteCompanyById = async (req, res, next) => {
    let responseCode = 401
    let message = ""
    const { companyId } = req.body
    try {
        let company = await Company.findByIdAndDelete(companyId)
        res.status(200).json({
            company
        })
        return
    } catch (e) {

        console.error(e)
        responseCode = 500
        message = "Internal server error"
    }
    res.status(responseCode).json({
        message,
        errors: {
            message
        }
    })
}


module.exports.deleteInventoryById = async (req, res, next) => {
    let responseCode = 401
    let message = ""
    try {

    } catch (e) {
        console.error(e)
        responseCode = 500
        message = "Internal server error"
    }
    res.status(responseCode).json({
        message,
        errors: {
            message
        }
    })
}

module.exports.deleteAllInventory = async (req, res, next) => {
    let responseCode = 401
    let message = ""
    try {

    } catch (e) {
        console.error(e)
        responseCode = 500
        message = "Internal server error"
    }
    res.status(responseCode).json({
        message,
        errors: {
            message
        }
    })
}

module.exports.getAllInventories = async (req, res, next) => {
    let responseCode = 401
    let message = ""
    try {
        const inventories = await Inventory.find({})
        res.status(200).json({
            inventories
        })
        return
    } catch (e) {
        console.error(e)
        responseCode = 500
        message = "Internal server error"
    }
    res.status(responseCode).json({
        message,
        errors: {
            message
        }
    })
}

module.exports.getAllInventoriesByCompanyName = async (req, res, next) => {
    let responseCode = 401
    let message = ""
    let { companyName } = req.body
    companyName = toLower(companyName)
    try {
        let inventories = await Inventory.find({
            companyName
        })
        res.status(200).json({
            inventories
        })
        return
    } catch (e) {
        console.error(e)
        responseCode = 500
        message = "Internal server error"

    }
    res.status(responseCode).json({
        message,
        errors: {
            message
        }
    })
}

module.exports.getSingleCompanyByName = async (req, res, next) => {
    let responseCode = 401
    let message = ""
    let { companyName } = req.body
    try {
        let company = await Company.findOne({
            name: companyName
        })

        res.status(200).json({
            company
        })
        return
    } catch (e) {
        console.error(e)
        responseCode = 500
        message = "Internal server error"

    }
    res.status(responseCode).json({
        message,
        errors: {
            message
        }
    })
}