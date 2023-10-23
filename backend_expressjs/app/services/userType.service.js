const { UserType } = require('../models/index.model');
const BaseService = require('./base.service');

class UserTypeService extends BaseService {
	constructor() {
		super(UserType);
	}

	search(whereClause, page = 1, size = 10) {
		const excludeAttribute = ['deleted_at'];
		return super.search(whereClause, page, size, excludeAttribute);
	}
}

module.exports = new UserTypeService();
