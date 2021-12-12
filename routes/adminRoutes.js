const express = require('express')
const { adminSignUp, adminSignIn, generateCouponsByAdmin,
    deleteAllCouponsByAdmin, listAllUsersByAdmin, redeemCouponByAdmin } = require('../controllers/adminController')
const router = express.Router()

router.post('/signin', adminSignIn)
router.post('/signup', adminSignUp)
router.post('/coupons/generate', generateCouponsByAdmin)
router.post('/coupons/redeem', redeemCouponByAdmin)
router.post('/coupons/delete/all', deleteAllCouponsByAdmin)
router.get('/users/list', listAllUsersByAdmin)
module.exports = router