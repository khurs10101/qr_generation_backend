const jwt = require('jsonwebtoken')
const { isUndefined, isEmpty } = require('lodash')
const { AwesomeQR } = require("awesome-qr")
const fs = require("fs")
const path = require('path')
const Admin = require('../models/adminModel')
const User = require("../models/userModel")
const Coupon = require('../models/couponModel')
const { JWT_SECRET: secret } = require('../configs')
const { checkAndBundleNonEmptyFields } = require('../utils')
module.exports.adminSignUp = async (req, res, next) => {
    const { email, password } = req.body
    let responseCode = 401;
    let message = ""
    if (!isEmpty(email) && !isEmpty(password))
        try {
            let admin = await Admin.findOne({
                email
            })

            if (!admin) {
                admin = new Admin({
                    email, password
                })

                admin = await admin.save()
                let token = jwt.sign({
                    email: admin.email
                },
                    secret,
                    {
                        expiresIn: 86400
                    })

                res.status(201).json({
                    message: "Admin signed up successfully",
                    token
                })

                return

            } else {
                responseCode = 409
                message = "Admin already exists, please signin"
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

module.exports.adminSignIn = async (req, res, next) => {
    const { email, password } = req.body
    let responseCode = 401
    let message = ""
    if (!isEmpty(email) && !isEmpty(password))
        try {
            let admin = await Admin.findOne({
                email
            })
            if (admin) {
                if (admin['password'] === password) {
                    let token = jwt.sign({
                        email: admin['email']
                    }, secret, {
                        expiresIn: 86400
                    })
                    res.status(200).json({
                        message: "Admin signed in successfully",
                        token
                    })
                    return
                } else {
                    responseCode = 401
                    message = "Email or Password Incorrect"
                }
            } else {
                responseCode = 404
                message = "Admin not found"
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

module.exports.updateUserByAdmin = async (req, res, next) => {
    const id = req.params.id
    const finalUser = checkAndBundleNonEmptyFields(req.body)
    let responseCode = 401
    let message = ""
    if (!isEmpty(finalUser))
        try {
            let user = await User.findById(id)
            if (user) {
                let user = {
                    ...user._doc,
                    ...finalUser
                }
                user = await User.updateOne(user)
                res.status(200).json({
                    message: "User updated successfully"
                })
                return
            } else {
                responseCode = 404
                message = `No user found with id ${id}`
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

module.exports.listAllUsersByAdmin = async (req, res, next) => {
    responseCode = 401
    message = ""
    try {
        let users = await User.find({})
        res.status(200).json({
            message: "All users",
            users
        })
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


module.exports.generateCouponsByAdmin = async (req, res, next) => {
    responseCode = 401
    message = ""
    const { name, value, quantity } = req.body
    try {

        let coupons = []
        for (let i = 0; i < quantity; i++) {
            let coupon = new Coupon({
                name,
                value
            })
            coupon = await coupon.save()
            let couponName = `qr_code_${coupon._id}.png`
            let couponUrl = `qr_codes/${couponName}`
            const buffer = await new AwesomeQR({
                text: `id=${coupon._id}&&name=${coupon.name}&&value=${coupon.value}`,
                size: 150,
            }).draw();
            coupon = {
                ...coupon._doc,
                couponUrl
            }

            // console.log(coupon)
            await Coupon.findByIdAndUpdate(coupon.id, {
                couponUrl: couponUrl
            })
            fs.writeFileSync(couponUrl, buffer);
            coupons.push(coupon)
        }

        res.status(201).json({
            message: "Coupons generated successfully",
            coupons
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

module.exports.deleteAllCouponsByAdmin = async (req, res, next) => {
    const directory = 'qr_codes';

    try {
        await Coupon.remove({})
        fs.readdir(directory, (err, files) => {
            if (err) throw err;

            for (const file of files) {
                fs.unlink(path.join(directory, file), err => {
                    if (err) throw err;
                });
            }
        });

        res.status(200).json({
            message: "All coupons deleted"
        })
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


module.exports.redeemCouponByAdmin = async (req, res, next) => {
    responseCode = 401
    message = ""
    const { userId, newValue } = req.body
    try {
        let coupon = await User.findById(userId)
        if (coupon) {
            let newCollected = parseInt(coupon.collectedPoints) - parseInt(newValue)
            message = "Coupon redeemed"
            if (newCollected < 0) {
                newCollected = coupon.collectedPoints
                message = "Coupon cannot be redeemed as the user dont have sufficient balance"
            }
            let newRedeemed = parseInt(coupon.redeemedPoints) + parseInt(newValue)
            await User.findByIdAndUpdate(userId, {
                collectedPoints: newCollected,
                redeemedPoints: newRedeemed
            })
            coupon = await User.findById(userId)
            res.status(200).message({
                message,
                user: coupon
            })
        } else {
            responseCode = 404
            message = `Coupon with code ${couponId} doesn't exists`
        }
    } catch (e) {
        console.error(e)
        responseCode = 500
        message = "Internal server error"
    }
}