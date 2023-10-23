const SensorDataModel = require('../schema/sensorData.schema')
const logger = require('../config/winston.config')
const {appConstant} = require('../constant')
const {lastXhrs, lastAQIHourXhrs, nowCast} = require('../utils/lastXhrs')
const fetch = require('node-fetch')
const {
    AQIPM25,
    AQIPM10,
    AQICO,
    AQISO21hr,
    AQISO224hr,
    AQIO38hr,
    AQIO31hr,
    AQINO2,
    AQICategory
} = require('../utils/conc-aqi')
const {AQIViewHourlyModel, AQIViewDailyModel} = require("../schema/aqiView.schema");
const {AVGConcentration}  = require("../schema/avgConcentration.schema");

class BlockMemory {
    constructor() {
        this.memory = []
        this.valueSetup = []
    }

    setup(value) {
        this.valueSetup = value
    }

    add(topic, record) {
        if (this.validateRecord(topic, record)) {
            console.log('add record to queue')
            this.memory.push(JSON.parse(record))
        }
        else{
            console.log('add record error')
        }
    }

    validateRecord(topic, record) {
        let recordObj = {}
        try {
            recordObj = JSON.parse(record)
        } catch (err) {
            console.log('Message formatting error: ', err, record)
            logger.error({record, topic, cause: appConstant.ERROR_PARSE_JSON})
            return false
        }
        console.log(recordObj)
        if (Object.keys(recordObj).length === 0) {
            logger.error({record, topic, cause: appConstant.ERROR_RECORD_FORMAT})
            return false
        }
        const sensorData = new SensorDataModel(recordObj)
        const error = sensorData.validateSync()
        if (!!error) {
            console.log('Schema validation error: ', error)
            logger.error({record, topic, cause: appConstant.ERROR_RECORD_FORMAT})
            return false
        }
        return true
    }

    isNull() {
        return this.memory.length === 0
    }

    clearMemory() {
        this.memory = []
    }

    saveAll() {
        const data = this.memory
        SensorDataModel.insertMany(data).then(() => {
            console.log('insert many success'
            )
        }).catch(e => {
            console.log('insert many error', e)
        })
    }
    async updateDaily(){
        const locations = await (await fetch(`${process.env.EXPRESS_URL}/webExpose/location-ids`)).json()
        const listUpdateAQIDaily = []
        const listUpdateAvgDaily = []
        for (const i of locations) {
            const last24Concentration = await lastAQIHourXhrs(i , 24);
            if(last24Concentration.length === 0) break;
            const PM2p5OfDay = last24Concentration.reduce((prev, cur) => prev + cur.PM2p5, 0) / last24Concentration.length
            const PM10OfDay = last24Concentration.reduce((prev, cur) => prev + cur.PM10, 0) / last24Concentration.length
            /** debug lai ham nay*/
            const SO2OfDay = Math.max(...last24Concentration.map(item=>item.SO2))
            const avgSO2OfDay = last24Concentration.reduce((prev, cur) => prev + cur.SO2, 0) / last24Concentration.length
            const NO2OfDay = Math.max(...last24Concentration.map(item=>item.NO2))
            const avgNO2OfDay = last24Concentration.reduce((prev, cur) => prev + cur.NO2, 0) / last24Concentration.length
            const COOfDay = Math.max(...last24Concentration.map(item=>item.CO))
            const avgCOOfDay = last24Concentration.reduce((prev, cur) => prev + cur.CO, 0) / last24Concentration.length
            let O3OfDay = 0;
            if(Math.max(...last24Concentration.map(item=>item.O3in8Hr))>400){
                O3OfDay = Math.max(...last24Concentration.map(item=>item.O3))
            }else{
                O3OfDay = Math.max( Math.max(...last24Concentration.map(item=>item.O3) , Math.max(...last24Concentration.map(item=>item.O3in8Hr)) ))
            }
            const avg03OfDay = last24Concentration.reduce((prev, cur) => prev + cur.O3, 0) / last24Concentration.length

            const avgHumidityDay = last24Concentration.reduce((prev, cur) => prev + cur.humidity, 0) / last24Concentration.length
            const avgTemperatureDay = last24Concentration.reduce((prev, cur) => prev + cur.temperature, 0) / last24Concentration.length
            const avgPressureDay = last24Concentration.reduce((prev, cur) => prev + cur.pressure, 0) / last24Concentration.length
            const avgWindspeedDay = last24Concentration.reduce((prev, cur) => prev + cur.windSpeed, 0) / last24Concentration.length

            listUpdateAQIDaily.push({
                AQIPM25: AQIPM25(PM2p5OfDay),
                AQIPM10: AQIPM10(PM10OfDay),
                AQICO: AQICO(COOfDay),
                AQISO2: AQISO21hr(SO2OfDay),
                AQIO3 : AQIO31hr(O3OfDay) ,
                AQINO2: AQINO2(NO2OfDay),
                AQIGeneral: Math.max(
                    AQIPM25(PM2p5OfDay),
                    AQIPM10(PM10OfDay),
                    AQICO(COOfDay),
                    AQISO21hr(SO2OfDay),
                    AQIO31hr(O3OfDay),
                    AQINO2(NO2OfDay)
                ),
                AQICategory: AQICategory(Math.max(
                    AQIPM25(PM2p5OfDay),
                    AQIPM10(PM10OfDay),
                    AQICO(COOfDay),
                    AQISO21hr(SO2OfDay),
                    AQIO31hr(O3OfDay),
                    AQINO2(NO2OfDay)
                )),
                locationId: i
            })
            listUpdateAvgDaily.push({
                locationId: i,
                NO2 : avgNO2OfDay,
                O3 : avg03OfDay,
                O3in8Hr : null,
                SO2 : avgSO2OfDay,
                CO : avgCOOfDay,
                PM2p5 : PM2p5OfDay,
                PM10 : PM10OfDay,
                humidity : avgHumidityDay,
                temperature : avgTemperatureDay,
                pressure : avgPressureDay ,
                windSpeed : avgWindspeedDay,
                type : 1
            })
        }
        AQIViewDailyModel.insertMany(listUpdateAQIDaily)
        AVGConcentration.insertMany(listUpdateAvgDaily)
    }
    async updateHourly() {
        const last24 = await lastXhrs(24) // For PM2.5, PM10, and SO2
        const last12 = last24.filter(item=>item.createdAt > Date.now()-12*60*60*1000).sort(function(a,b){
            if(a.createdAt < b.createdAt) return -1;
            if(a.createdAt > b.createdAt) return 1;
            return 0
        })
        const last8 = last24.filter(item=>item.createdAt > Date.now()-8*60*60*1000)
        const last1 = last24.filter(item=>item.createdAt > Date.now()-1*60*60*1000)
        // const last8 = await lastXhrs(8)   // For CO and O3
        // const last1 = await lastXhrs(1)   // For SO2, O3, and NO2

        const locations = await (await fetch(`${process.env.EXPRESS_URL}/webExpose/location-ids`)).json()
        const listUpdateAQIHourly = []
        const listUpdateAvgHourly = []
        for (const i of locations) {
            const last24i = last24?.filter(item => item.locationId === i)
            if(last24i.length === 0) break;
            const last12i = last12?.filter(item => item.locationId === i)
            const last8i = last8?.filter(item => item.locationId === i)
            const last1i = last1?.filter(item => item.locationId === i)

            /** hai chất này phải dùng nowCast */
            // const avgPM2p5 = last24i.reduce((prev, cur) => prev + cur.PM2p5, 0) / last24i.length   // µg/m^3
            // const avgPM10 = last24i.reduce((prev, cur) => prev + cur.PM10, 0) / last24i.length     // µg/m^3
            const nowCastPM2p5 = nowCast(last12i.map(item=>item.PM2p5))
            const nowCastPM10 = nowCast(last12i.map(item=>item.PM10))
            const avgSO224 = last24i.reduce((prev, cur) => prev + cur.SO2, 0) / last24i.length     // ppb
            const avgCO = (last8i.reduce((prev, cur) => prev + cur.CO, 0) / last8i.length) / 1000  // ppm
            const avgO38 = last8i.reduce((prev, cur) => prev + cur.O3, 0) / last8i.length          // ppb

            const avgO31 = last1i.reduce((prev, cur) => prev + cur.O3, 0) / last1i.length          // ppb
            const avgSO21 = last1i.reduce((prev, cur) => prev + cur.SO2, 0) / last1i.length        // ppb
            const avgNO2 = last1i.reduce((prev, cur) => prev + cur.NO2, 0) / last1i.length         // ppb
            /** for update avg schema */
            const avgPM2p5hour = last1i.reduce((prev, cur) => prev + cur.PM2p5, 0) / last1i.length
            const avgPM10hour = last1i.reduce((prev, cur) => prev + cur.PM10, 0) / last1i.length     // µg/m^3
            const avgCOHour = (last1i.reduce((prev, cur) => prev + cur.CO, 0) / last1i.length) / 1000  // ppm
            const avgHumidityHour = last1i.reduce((prev, cur) => prev + cur.humidity, 0) / last1i.length  // ppm
            const avgTemperatureHour = last1i.reduce((prev, cur) => prev + cur.temperature, 0) / last1i.length  // ppm
            const avgPressureHour = last1i.reduce((prev, cur) => prev + cur.pressure, 0) / last1i.length  // ppm
            const avgWindspeedHour = last1i.reduce((prev, cur) => prev + cur.windSpeed, 0) / last1i.length  // ppm


            listUpdateAQIHourly.push({
                AQIPM25: AQIPM25(nowCastPM2p5),
                AQIPM10: AQIPM10(nowCastPM10),
                AQICO: AQICO(avgCO),
                AQISO2: AQISO21hr(avgSO21),
                AQIO3 : AQIO31hr(avgO31) ,
                AQINO2: AQINO2(avgNO2),
                AQIGeneral: Math.max(
                    AQIPM25(nowCastPM2p5),
                    AQIPM10(nowCastPM10),
                    AQICO(avgCO),
                    AQISO21hr(avgSO21),
                    AQIO31hr(avgO31),
                    AQINO2(avgNO2)
                ),
                AQICategory: AQICategory(Math.max(
                    AQIPM25(nowCastPM2p5),
                    AQIPM10(nowCastPM10),
                    AQICO(avgCO),
                    AQISO21hr(avgSO21),
                    AQIO31hr(avgO31),
                    AQINO2(avgNO2)
                )),
                locationId: i
            })
            listUpdateAvgHourly.push({
                locationId: i,
                NO2 : avgNO2,
                O3 : avgO31,
                O3in8Hr : avgO38,
                SO2 : avgSO21,
                CO : avgCOHour,
                PM2p5 : avgPM2p5hour,
                PM10 : avgPM10hour,
                humidity : avgHumidityHour,
                temperature : avgTemperatureHour,
                pressure : avgPressureHour ,
                windSpeed : avgWindspeedHour,
                type : 0
            })
        }
        AQIViewHourlyModel.insertMany(listUpdateAQIHourly)
        AVGConcentration.insertMany(listUpdateAvgHourly)
    }
}

module.exports = new BlockMemory()