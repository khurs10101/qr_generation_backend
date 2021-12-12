const jwt = require('jsonwebtoken')
const { isEmpty } = require('lodash')
const User = require('../models/userModel')
const Coupon = require('../models/couponModel')
const { JWT_SECRET: secret, } = require('../configs')
const e = require('express')

module.exports.userSignUp = async (req, res, next) => {
    let responseCode = 401
    let message = ""
    const { name, phone, bankAccountNumber, password, city, states } = req.body
    if (!isEmpty(name) && !isEmpty(phone) && !isEmpty(bankAccountNumber) && !isEmpty(password))
        try {
            let user = await User.findOne({
                phone
            })
            if (!user) {
                user = new User({
                    name, phone, bankAccountNumber, password, city, states
                })
                user = await user.save()
                delete user.password
                let token = jwt.sign({
                    ...user
                },
                    secret,
                    {
                        expiresIn: 86400
                    })

                res.status(201).json({
                    message: "User signed up successfully",
                    token,
                    user
                })
                return
            } else {
                responseCode = 409
                message = "User already exists, Please sign in"
            }
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

module.exports.userSignIn = async (req, res, next) => {
    let responseCode = 401
    let message = ""
    const { phone, password } = req.body
    if (!isEmpty(phone) && !isEmpty(password))
        try {
            let user = await User.findOne({
                phone, password
            })
            if (user) {
                delete user.password
                let token = jwt.sign({
                    ...user
                },
                    secret,
                    {
                        expiresIn: 86400
                    })

                res.status(200).json({
                    message: "User signed up successfully",
                    token,
                    user
                })
                return
            } else {
                responseCode = 404
                message = "User doesn't exists"
            }
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

module.exports.getUserById = async (req, res, next) => {
    let responseCode = 401
    let message = ""
    const userId = req.params.id
    try {
        let user = await User.findById(userId)
        if (user) {
            res.status(200).json({
                message,
                user
            })
            return
        } else {
            responseCode = 404
            message = "User not found"
        }

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

module.exports.redeemCouponByUser = async (req, res, next) => {
    let responseCode = 401
    let message = ""
    const { userId, couponId } = req.body

    try {
        let coupon = await Coupon.findOne({
            _id: couponId, userId
        })

        if (!coupon) {
            coupon = await Coupon.findOne({
                _id: couponId
            })
            if (coupon.isRedeemed === 0) {
                console.log(coupon)
                if (coupon) {
                    console.log(coupon.id)
                    await Coupon.findByIdAndUpdate(coupon.id,
                        {
                            userId: userId,
                            isRedeemed: 1
                        }
                    )

                    let user = await User.findById(userId)
                    let newValue = parseInt(user.collectedPoints) + parseInt(coupon.value)
                    await User.findByIdAndUpdate(userId, {
                        collectedPoints: newValue
                    })
                    res.status(200).json({
                        message: "Coupon redeemed",
                        coupon
                    })
                    return
                } else {
                    responseCode = 404
                    message = "Coupon doesn't exists"
                }
            } else {
                responseCode = 404
                message = "Coupon doesn't exists"
            }
        } else {
            responseCode = 404
            message = "Coupon already used and doesn't exists"
        }
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

module.exports.findCouponsByUserId = async (req, res, next) => {
    const userId = req.params.id
    let responseCode = 401
    let message = ""
    try {
        let coupons = await Coupon.find({
            userId
        })
        if (coupons) {
            res.status(200).json({
                message: `Coupon list of user ${userId}`,
                coupons
            })
            return
        } else {
            responseCode = 404
            message = "No coupon found for user"
        }
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

