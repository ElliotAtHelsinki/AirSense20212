const manifestService = require('../services/manifest.service');
const BaseController = require('./base.controller');
const { handleError } = require('../services/handleError.util-service');
const { messageConst, statusCode } = require('../constant');
const { BAD_REQUEST_CODE } = statusCode;

class ManifestController extends BaseController {
	constructor() {
		super(manifestService);
	}

	async insert(req, res, next) {
		try {
			const result = await manifestService.insert(req, res);
			BaseController.checkServiceResult(result, res, 'Thêm quyền hạn thành công');
		} catch (e) {
			handleError(e, res);
		}
	}

	async update(req, res, next) {
		if (isNaN(req.params.id)) {
			return res.status(BAD_REQUEST_CODE).send({ msg: messageConst.BAD_PARAMETER });
		}
		try {
			const result = await manifestService.update(req, res);
			BaseController.checkServiceResult(result, res, 'Cập nhật quyền hạn thành công');
		} catch (e) {
			handleError(e, res);
		}
	}
}

module.exports = new ManifestController();
