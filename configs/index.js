const dotenv = require('dotenv')
dotenv.config()
const MONGO_DB_LINK = process.env.MONGO_DB_LINK
// const AWS_ACCESS_KEY_ID = process.env.AWS_ACCESS_KEY_ID
// const AWS_SECRET_ACCESS_ID = process.env.AWS_SECRET_ACCESS_ID
const JWT_SECRET = process.env.JWT_SECRET
const PORT = process.env.PORT
// const AWS_S3_REGION = process.env.AWS_S3_REGION

module.exports = { MONGO_DB_LINK, JWT_SECRET, PORT }