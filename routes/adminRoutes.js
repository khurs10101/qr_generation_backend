const express = require('express')
const { adminSignUp, adminSignIn, generateCouponsByAdmin,
    deleteAllCouponsByAdmin,
    listAllUsersByAdmin,
    redeemCouponByAdmin,
    updateAdminByAdmin,
    updateUserByAdmin,
    listAllAdmins, getCouponsByBatchNumber,
    getBatchDetailsByProduct,
    deleteAdminByAdmin } = require('../controllers/adminController')
const router = express.Router()

router.post('/delete', deleteAdminByAdmin)
router.post('/signin', adminSignIn)
router.post('/signup', adminSignUp)
router.post('/update/user/:id', updateUserByAdmin)
router.post('/update/admin/:id', updateAdminByAdmin)
router.post('/coupons/generate', generateCouponsByAdmin)
router.post('/coupons/redeem', redeemCouponByAdmin)
router.post('/coupons/delete/all', deleteAllCouponsByAdmin)
router.get('/users/list', listAllUsersByAdmin)
router.get('/list', listAllAdmins)
router.post('/coupons/getCouponsByBatch', getCouponsByBatchNumber)
router.post('/batch/getByProduct', getBatchDetailsByProduct)

module.exports = router