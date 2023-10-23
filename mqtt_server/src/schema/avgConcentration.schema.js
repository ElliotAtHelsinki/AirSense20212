const mongoose = require('mongoose')

const avgConcentrationSchema = new mongoose.Schema({
    locationId: {type: Number},
    O3: {type: Number, min: 0},    // ug/m3
    O3in8Hr :{type: Number, min: 0},
    PM2p5: {type: Number, min: 0},
    PM10: {type: Number, min: 0},
    CO: {type: Number, min: 0},
    NO2: {type: Number, min: 0},
    SO2: {type: Number, min: 0},
    humidity: {type: Number, min: 0},
    temperature: {type: Number, min: 0},
    pressure: {type: Number, min: 0},
    windSpeed: {type: Number, min: 0},
    type : {type : Number , default : 0  } // 0: hourly , 1 : daily
} , {timestamps : true})
module.exports = {
    AVGConcentration : mongoose.model('avgConcentration', avgConcentrationSchema, 'avgConcentration',)
}