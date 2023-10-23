const MQTTClient = require("../config/mqtt.config");
const {sensorChannel, mqttChannel, returnCode} = require("../constant");
const blockMem = require("../model/blockMem.model");

class SensorService {
    changeStepTime(req , res) {
        const {time , locationId , macId}  = req.body
        const topic = ()=>{
            return sensorChannel(locationId , macId)["REQUEST_SETUP_TIME"]
        }
        MQTTClient.publish(topic() , JSON.stringify({time: time}) , {qos:2} , (error => {
            if(!error){
                res.status(200).json({msg : 'Gửi bản tin thành công'})
            }else {
                console.log(error)
                res.status(500).json({msg : "Gửi bản tin thất bại , vui lòng thử lại"})
            }
        }))

    }

    toggleActive(req , res , type ) {
        const {status , locationId , macId}  = req.body
        const topic = ()=>{
            return sensorChannel(locationId , macId)[type]
        }
        console.log(topic())
        MQTTClient.publish(topic() , JSON.stringify({status: status}) , {qos:2} , error => {
            if(!error){
                res.status(200).json({msg : 'Gửi bản tin thành công'})
            }else {
                console.log(error)
                res.status(500).json({msg : "Gửi bản tin thất bại , vui lòng thử lại"})
            }
        })
    }

}

module.exports = new SensorService();