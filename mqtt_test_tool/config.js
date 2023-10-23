const mqtt = require('mqtt');
const {Worker} = require('worker_threads')

const randomDataObj = (sensorId, locationId) => ({
    macId: sensorId,
    locationId: locationId,
    CO: Math.random() * 50.5 * 1000,   //ppb , range : 0-50.5
    O3: Math.random() * 605,   //ppb   <=> ug/m3
    SO2: Math.random() * 1000,   //ppb
    NO2: Math.random() * 2050,    //ppb
    PM10: Math.random() * 605,     // ug/m3
    PM2p5: Math.random() * 500.5,   // ug/m3
    humidity: Math.random() * 100,
    temperature: Math.random() * 40,
    pressure: 100000 + Math.random() * 1000,
    windSpeed: Math.random() * 10,
    createdAt: Date.now()
})

module.exports = (configArr) => {
    configArr.forEach(config => {
        const MqttClient = mqtt.connect('http://3.144.126.83:1883', {
            clientId: config.clientId,
            clean: true,
            connectTimeout: 4000,
            reconnectPeriod: 1000,
            username: 'airsense',
            password: 'airsense',
        });

        MqttClient.on('connect', async () =>  {
            setInterval(
                () => MqttClient.publish(config.topic, JSON.stringify(randomDataObj(config.sensorId , config.locationId))), config.timeStep
            )
        });
    })

}
