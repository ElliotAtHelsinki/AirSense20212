const userTypeService = require('../services/userType.service');
const BaseController = require('./base.controller');

class userTypeController extends BaseController {
	constructor() {
		super(userTypeService);
	}
}

module.exports = new userTypeController();
