// const SensorDataModel = require('../schema/sensorData.schema')
//
// for (let i = 0; i < 2000; i++) {
//   SensorDataModel.create({
//     macId: 1,
//     locationId: [1, 8, 9, 10, 11][Math.round(Math.random() * 4)],
//     CO: Math.random() * 50400,
//     O3: Math.random() * 604,
//     SO2: Math.random() * 1004,
//     NO2: Math.random() * 2049,
//     PM10: Math.random() * 604,
//     PM2p5: Math.random() * 500.4,
//     humidity: Math.random() * 100,
//     temperature: Math.random() * 40,
//     press: 100000 + Math.random() * 1000,
//     wind: Math.random() * 10,
//     createdAt: Date.now() - (Math.random() * 24) * 60 * 60 * 1000
//   })
// }