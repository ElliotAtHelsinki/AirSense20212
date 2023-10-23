const sensorDeviceService = require('../services/sensorDevice.service');
const BaseController = require('./base.controller');
const { handleError } = require('../services/handleError.util-service');
const { messageConst, statusCode } = require('../constant');

class SensorDeviceController extends BaseController {
	constructor() {
		super(sensorDeviceService);
	}

	async insert(req, res, next) {
		try {
			if (req.id) {
				req.body.created_id = req.id;
			}
			const result = await this.service.insert(req.body, res);
			BaseController.checkServiceResult(result, res, 'Tạo mới thiết bị thành công');
		} catch (e) {
			handleError(e, res);
		}
	}

	async update(req, res, next) {
		try {
			if (req.id) {
				req.body.updated_id = req.id;
			}
			const result = await this.service.update(req.body, res, { where: { id: req.params.id } });
			BaseController.checkServiceResult(result, res, 'Cập nhật thiết bị thành công');
		} catch (e) {
			handleError(e, res);
		}
	}

	async toggleActive(req, res, next) {
		try {
			const { id, type } = req.params;
			const result = await sensorDeviceService.toggleActive(id, type);
			BaseController.checkServiceResult(result, res, 'Cập nhật thiết bị thành công');
		} catch (e) {
			handleError(e, res);
		}
	}
}

module.exports = new SensorDeviceController();
