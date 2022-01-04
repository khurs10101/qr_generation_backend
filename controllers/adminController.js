const jwt = require('jsonwebtoken')
const { isUndefined, isEmpty } = require('lodash')
const { AwesomeQR } = require("awesome-qr")
const fs = require("fs")
const path = require('path')
const { v1 } = require('uuid')
const Admin = require('../models/adminModel')
const User = require("../models/userModel")
const Coupon = require('../models/couponModel')
const BatchNumber = require('../models/batchModel')
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

module.exports.updateAdminByAdmin = async (req, res, next) => {
    let responseCode = 401
    let message = ""
    const adminId = req.params.id
    const params = checkAndBundleNonEmptyFields(req.body)
    try {
        const admin = await Admin.findByIdAndUpdate(adminId, {
            ...params
        })
        if (admin) {
            res.status(200).json({
                admin
            })
            return
        } else {
            responseCode = 404
            message = `admin not found with id ${adminId}`
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
            delete finalUser._id
            let user = await User.findByIdAndUpdate(id, {
                ...finalUser
            })
            if (user) {
                res.status(200).json({
                    message: "User updated successfully",
                    user
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

module.exports.getCouponByProductDetails = async (req, res, next) => {
    let responseCode = 401
    let message = ""
    let params = checkAndBundleNonEmptyFields(req.body)
    try {
        let coupons = await Coupon.find({
            ...params
        })

        res.status(200).json({
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


module.exports.generateCouponsByAdmin = async (req, res, next) => {
    responseCode = 401
    message = ""
    const { companyName, name, label, value, quantity, couponType } = req.body
    let batchNumber = Date.now()
    try {

        let coupons = []
        let batchNumberObj = new BatchNumber({
            batchNumber,
            companyName,
            name,
            couponType
        })
        batchNumberObj = await batchNumberObj.save()
        batchNumber = batchNumberObj.batchNumber
        for (let i = 0; i < quantity; i++) {
            let coupon = new Coupon({
                batchNumber,
                companyName,
                name,
                label,
                value,
                couponType
            })
            coupon = await coupon.save()
            let couponName = `qr_code_${coupon._id}.png`
            let couponUrl = `qr_codes/${couponName}`
            const buffer = await new AwesomeQR({
                text: `id=${coupon._id}&&name=${coupon.name}&&value=${coupon.value}`,
                size: 200,
            }).draw();

            coupon = {
                ...coupon._doc,
                couponUrl
            }

            await Coupon.findByIdAndUpdate(coupon._id, {
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

module.exports.getBatchDetailsByProduct = async (req, res, next) => {
    let responseCode = 401
    let message = ""
    let params = checkAndBundleNonEmptyFields(req.body)
    try {
        let batchList = await BatchNumber.find({
            ...params
        })
        res.status(200).json({
            batchList
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

module.exports.getCouponsByBatchNumber = async (req, res, next) => {
    let responseCode = 401
    let message = ""
    let params = checkAndBundleNonEmptyFields(req.body)
    try {
        let coupons = await Coupon.find({
            ...params
        })

        res.status(200).json({
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


module.exports.redeemCouponByAdmin = async (req, res, next) => {
    responseCode = 401
    message = ""
    const { userId, newValue } = req.body
    try {
        let coupon = await User.findById(userId)
        if (coupon) {
            let newCollected = parseInt(coupon.collectedPoints) - parseInt(newValue)
            message = "Coupon redeemed"
            newCollected = coupon.collectedPoints
            let newRedeemed = parseInt(coupon.redeemedPoints) + parseInt(newValue)

            if (coupon.collectedPoints >= newRedeemed) {
                coupon = await User.findByIdAndUpdate(userId, {
                    collectedPoints: newCollected,
                    redeemedPoints: newRedeemed
                })

                res.status(200).json({
                    message,
                    user: coupon
                })
                return
            } else {
                message = `Redeemed points is ${parseInt(newCollected) - parseInt(coupon.collectedPoints)} greater than collected points`
            }

        } else {
            responseCode = 404
            message = `Coupon with userId ${userId} doesn't exists`
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

module.exports.listAllAdmins = async (req, res, next) => {
    responseCode = 401
    message = ""
    try {
        let admins = await Admin.find({})
        res.status(200).json({
            admins
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