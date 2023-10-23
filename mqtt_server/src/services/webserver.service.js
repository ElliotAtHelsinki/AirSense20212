const fetch = require('node-fetch')
const {AppKey} = require("../constant");

const WEB_SERVER_ENDPOINT = process.env.STATUS === 'development' ?
    'http://localhost:3001'
    : process.env.EXPRESS_URL

class WebserverService {
    async confirmChangeStatusSensor(type, macId, status, time) {
        console.log(WEB_SERVER_ENDPOINT)
        const result = await fetch(`${WEB_SERVER_ENDPOINT}/webExpose/confirm-status`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: status ? JSON.stringify({macId, type, status , AppKey }) : JSON.stringify({macId, type, time})
        })
        return result.ok
    }
}

module.exports = new WebserverService()