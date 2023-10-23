const mqtt = require("mqtt");
const {mqttChannel, toggleType, getMacIdFromChannel} = require("../constant");
const blockMem = require("../model/blockMem.model");
const webServer = require('../services/webserver.service')

const MqttClient = mqtt.connect(process.env.MQTT_BROKER_URL, {
    clientId: `mqtt_server`,
    clean: true,
    connectTimeout: 4000,
    reconnectPeriod: 1000,
    username: process.env.MQTT_USER,
    password: process.env.MQTT_PASS,

});

MqttClient.on('connect',()=>{
    MqttClient.subscribe({'data/#': {qos: 2}, 'setup/response/+/+': {qos:2}},((err, granted) => {
        if(!err){
            // console.log('connect success')
        }else{
            console.log('connect fail')
        }
    }))
})

MqttClient.on("message", (topic, message, packet) => {
    console.log(topic, message.toString())
    if (mqttChannel.DATA.test(topic)) {
        blockMem.add(topic, message.toString().trim());
        return;
    }
    if (mqttChannel.SETUP_TIME.test(topic)) {
        try {
            const macId = getMacIdFromChannel(topic)
            const obj = JSON.parse(message.toString().trim())
            webServer.confirmChangeStatusSensor(toggleType.RESPONSE_SETUP_TIME, macId, null, obj.time)
            return;
        } catch (e) {
            console.log(e)
            return;
        }

    }
    if (mqttChannel.SETUP_STATUS.test(topic)) {
        try {

            const macId = getMacIdFromChannel(topic)
            const obj = JSON.parse(message.toString().trim())
            webServer.confirmChangeStatusSensor(toggleType.RESPONSE_STATUS, macId, obj.status)
            return;
        } catch (e) {
            console.log(e)
            return;

        }
    }
    if (mqttChannel.SETUP_ALARM.test(topic)) {
        try {
            const macId = getMacIdFromChannel(topic)
            const obj = JSON.parse(message.toString().trim())
            webServer.confirmChangeStatusSensor(toggleType.RESPONSE_ALARM, macId, obj.status)
        } catch (e) {
            console.log(e)
        }
    }
    if (mqttChannel.SETUP_PUMP.test(topic)) {
        try {
            const macId = getMacIdFromChannel(topic)
            const obj = JSON.parse(message.toString().trim())
            webServer.confirmChangeStatusSensor(toggleType.REQUEST_PUMP, macId, obj.status)
        } catch (e) {
            console.log(e)
        }
    }

});

module.exports = MqttClient
