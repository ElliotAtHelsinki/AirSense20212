const { v4 : uuidv4 } = require('uuid');

function genAppConfig(numberClient, locationId) {
    const result = [];
    for (let i = 0; i < numberClient; i++) {
        result.push({
            clientId: uuidv4(),
            topic: `data/${locationId}/${i}`,
            timeStep: (Math.round(Math.random() * 7) + 1) * 1000 * 60,  // random from 1 to 8 minute
            sensorId: i,
            locationId: locationId
        })
    }
    return result
}
// console.log(genAppConfig(10 , 1))
require('./config')(genAppConfig(10 , 1))
