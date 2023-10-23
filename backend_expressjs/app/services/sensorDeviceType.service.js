const { SensorDeviceType } = require('../models/index.model');
const BaseService = require('./base.service');
const { functionReturnCode } = require('../constant');
const { handleError } = require('./handleError.util-service');

class SensorDeviceTypeService extends BaseService {
	constructor() {
		super(SensorDeviceType);
	}
}

module.exports = new SensorDeviceTypeService();
