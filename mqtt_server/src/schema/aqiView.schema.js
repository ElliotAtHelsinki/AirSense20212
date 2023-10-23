const mongoose = require('mongoose')


const base = {
  AQIPM25: { type: Number },
  AQIPM10: { type: Number },
  AQICO: { type: Number },
  // AQISO21hr: { type: Number },
  // AQISO224hr: { type: Number },
  AQISO2: {type : Number},
  // AQIO38hr: { type: Number },
  // AQIO31hr: { type: Number },
  AQIO3 : {type:Number},
  AQINO2: { type: Number },
  AQIGeneral: { type: Number },
  AQICategory: { type: String },
  AVGHumidity: {type: Number, min: 0},
  AVGTemperature: {type: Number, min: 0},   // C
  AVGPressure: {type: Number, min: 0},        //ppa
  AVGWindSpeed: {type: Number, min: 0},
  locationId: { type: Number, required: true },
  // creationDate: { type: Number, default: new Date().getDate() },
  // creationMonth: { type: Number, default:  new Date().getMonth() + 1  },
  // creationYear: { type: Number, default: new Date().getFullYear()  },
}

const aqiViewHourlySchema = new mongoose.Schema({
  ...base,
  // creationHour: { type: Number, default: new Date().getHours() },
} , {timestamps : true})

const aqiViewDailySchema = new mongoose.Schema( base  , {timestamps : true})

module.exports = {
  AQIViewHourlyModel: mongoose.model('aqi-hourly', aqiViewHourlySchema, 'aqi-view-hourly'),
  AQIViewDailyModel: mongoose.model('aqi-daily', aqiViewDailySchema, 'aqi-view-daily')
} 