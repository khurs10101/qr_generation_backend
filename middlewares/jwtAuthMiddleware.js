const jwt =require('jsonwebtoken')
const { secret } = require('../configs/secret')
module.exports= (req, res, next) => {
    let token = req.headers['x-access-token']
    if (!token) {
        res.status(400).json({
            message: "Token not provided",
            errors: {
                message: "Token not provided"
            }
        })
    } else {
        jwt.verify(token, secret, (err, decoded) => {
            if (err) {
                return res.status(401).json({
                    message: "Failed to authenticate token",
                    errors: {
                        message: "Failed to authenticate token",
                    }
                })
            } else {
                req.decodedUser = decoded
                next()
            }
        })
    }
}

