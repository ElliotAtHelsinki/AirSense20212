const sensorRouter = require('./sensorConfig.route')

const allAppRoute = (app) => {
  app.use('', sensorRouter)
}

module.exports = allAppRoute