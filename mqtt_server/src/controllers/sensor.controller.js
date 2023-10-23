const sensorService = require('../services/sensor.service')


function changeStepTime(req , res) {
   return sensorService.changeStepTime(req , res)
}

function toggleActive(req , res , type) {
    return sensorService.toggleActive(req , res , type)
}

module.exports = {
    changeStepTime, toggleActive
}