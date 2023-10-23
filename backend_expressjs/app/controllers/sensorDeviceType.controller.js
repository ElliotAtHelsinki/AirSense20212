const sensorDeviceTypeService = require('../services/sensorDeviceType.service');
const BaseController = require('./base.controller');
const { handleError } = require('../services/handleError.util-service');
const { messageConst, statusCode } = require('../constant');

class SensorDeviceController extends BaseController {
	constructor() {
		super(sensorDeviceTypeService);
	}
}

module.exports = new SensorDeviceController();
