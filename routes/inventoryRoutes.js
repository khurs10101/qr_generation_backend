const express = require('express')
const { saveOrUpdateInventory, getAllInventories,
    saveCompanyDetails,
    getAllInventoriesByCompanyName,
    getAllCompanies,
    getSingleCompanyByName } = require('../controllers/inventoryController')

const router = express.Router()

router.post('/addAll', saveOrUpdateInventory)
router.get('/getAll', getAllInventories)
router.post('/addCompany', saveCompanyDetails)
router.get('/getCompany', getAllCompanies)
router.post('/getByCompanyName', getAllInventoriesByCompanyName)
router.post('/getSingleCompanyByName', getSingleCompanyByName)
router.post('/saveCompany', saveCompanyDetails)

module.exports = router