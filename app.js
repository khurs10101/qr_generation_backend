const http = require('http')
const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const mongoose = require('mongoose')
const { PORT, MONGO_DB_LINK } = require('./configs')
const adminRoutes = require('./routes/adminRoutes')
const userRoutes = require("./routes/userRoutes")
const inventoryRoutes = require('./routes/inventoryRoutes')

const app = express()
app.use(cors({ origin: '*' }))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

app.use('/qr_codes', express.static('qr_codes'))

mongoose.connect(MONGO_DB_LINK, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(result => {
        console.log("mongodb success")
    })
    .catch(err => {
        console.log("mongodb failed: " + err)
    })


app.use('/api/admins', adminRoutes)
app.use('/api/users', userRoutes)
app.use('/api/inventory', inventoryRoutes)



const server = http.createServer(app)
server.listen(PORT, () => {
    console.log(`server running at port ${PORT}`)
})
