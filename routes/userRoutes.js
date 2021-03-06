const express = require('express')
const { userSignIn, userSignUp,
    getUserById, redeemCouponByUser,
    userUpdate,
    findCouponsByUserId } = require("../controllers/userController")
const router = express.Router()

router.post('/signin', userSignIn)
router.post('/signup', userSignUp)
router.get('/:id', getUserById)
router.post('/update/:id', userUpdate)
router.post('/coupons/redeem', redeemCouponByUser)
router.get('/coupons/:id', findCouponsByUserId)

module.exports = router