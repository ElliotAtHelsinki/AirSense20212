const locationService = require('../services/location.service');
const BaseController = require('./base.controller');
const { handleError } = require('../services/handleError.util-service');
const { messageConst, statusCode, locationStatus } = require('../constant');
const { isEmpty, isUpdateHasNoEffect } = require('../utils');

const { BAD_REQUEST_CODE, CREATED_CODE } = statusCode;

class LocationController extends BaseController {
	constructor() {
		super(locationService);
	}

	async detail(req, res, next) {
		try {
			const result = await locationService.detail(req.params.id);
			return res.status(statusCode.SUCCESS_CODE).json(result);
		} catch (e) {
			1;
			handleError(e, res);
		}
	}

	async insert(req, res, next) {
		try {
			const result = await locationService.insert(req, res);
			return LocationController.checkServiceResult(result, res, 'Tạo mới trạm thành công');
		} catch (e) {
			handleError(e, res, Location.tableName);
		}
	}

	async update(req, res, next) {
		try {
			const result = await locationService.update(req, res);
			return LocationController.checkServiceResult(result, res, 'Cập nhật trạm thành công');
		} catch (e) {
			handleError(e, res, Location.tableName);
		}
	}

	async changeStatus(req, res, next) {
		if ([locationStatus.TESTING, locationStatus.DE_ACTIVE, locationStatus.ACTIVE].includes(+req.body.status)) {
			const result = await locationService.changeStatusActive(req.id, req.body.status);
			if (!isUpdateHasNoEffect(result)) {
				res.status(CREATED_CODE).json({ msg: messageConst.UPDATE_SUCCESS });
			} else {
				res.status(BAD_REQUEST_CODE).json({ msg: messageConst.NOT_FOUND });
			}
		} else return res.status(BAD_REQUEST_CODE).json({ msg: messageConst.NOT_EXIST_ENUM });
	}
}

module.exports = new LocationController();
