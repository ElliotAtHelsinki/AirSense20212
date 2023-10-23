const dashboardService = require('../services/dashboard.service');
const { statusCode, messageConst } = require('../constant');

class DashboardController {
	constructor() {
		this.service = dashboardService;
	}

	async getOverviewUser(req, res) {
		try {
			const result = await dashboardService.getOverviewUser(req);
			return res.status(statusCode.SUCCESS_CODE).json(result);
		} catch (e) {
			console.log(e);
			return res.status(statusCode.SERVER_ERROR_CODE).json({ msg: messageConst.SERVER_ERROR });
		}
	}

	async getOverviewLocation(req, res) {
		try {
			const result = await dashboardService.getOverviewLocation(req);
			return res.status(statusCode.SUCCESS_CODE).json(result);
		} catch (e) {
			console.log(e);
			return res.status(statusCode.SERVER_ERROR_CODE).json({ msg: messageConst.SERVER_ERROR });
		}
	}

	async getOverviewSensor(req, res) {
		try {
			const result = await dashboardService.getOverviewSensor(req);
			return res.status(statusCode.SUCCESS_CODE).json(result);
		} catch (e) {
			console.log(e);
			return res.status(statusCode.SERVER_ERROR_CODE).json({ msg: messageConst.SERVER_ERROR });
		}
	}

	// async getOverviewAqi(req, res) {
	// 	return dashboardService.getOverviewAqi(req);
	// }
}

module.exports = new DashboardController();
