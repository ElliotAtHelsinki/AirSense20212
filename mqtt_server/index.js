require('dotenv').config()
require('./src/config/mongodb.config')
require('./src/config/mqtt.config')
const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const cors = require('cors')
const http = require('http')
const allAppRoute = require('./src/routes/index.route')

// const blockMemory = require("./src/model/blockMem.model");
require('./src/services/cronJob')

app.use(cors())
app.use(express.json())
app.use(bodyParser.urlencoded({extended: true}))

const httpServer = http.createServer(app)
httpServer.listen(process.env.PORT || 3002, () => {
    if (process.env.STATUS === 'production') {
        console.log('server time build in', new Date().getHours() , new Date().getMonth() + 1 , new Date().getFullYear())

    }

    console.log(`MQTT Server started in ${process.env.STATUS} mode, listening on port ${process.env.PORT}.`)
})

// async function exe(){
//    await blockMemory.updateDaily()
// }
// exe();

allAppRoute(app)