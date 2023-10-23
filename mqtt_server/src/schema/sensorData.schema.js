const mongoose = require('mongoose')

const sensorDataSchema = new mongoose.Schema({
    macId: {type: Number},
    locationId: {type: Number},
    O3: {type: Number, min: 0},    //ug/m3
    PM2p5: {type: Number, min: 0},
    PM10: {type: Number, min: 0},
    CO: {type: Number, min: 0},
    NO2: {type: Number, min: 0},
    SO2: {type: Number, min: 0},
    humidity: {type: Number, min: 0},
    temperature: {type: Number, min: 0},   // C
    pressure: {type: Number, min: 0},        //ppa
    windSpeed: {type: Number, min: 0},          //ppa
    createdAt: {type: Number, required: true}
})
module.exports = mongoose.model('SensorData', sensorDataSchema, 'data')
