const { Permission } = require('../models/index.model');
const BaseService = require('./base.service');

class PermissionService extends BaseService {
	constructor() {
		super(Permission);
	}

	async search(whereClause, offset = 0, limit = 10) {
		const allPermission = (await Permission.findAll({ where: {}, raw: true })) || [];
		const result = allPermission?.filter((pm) => !pm.parent_id);
		result.map((parent) => {
			parent.subPermission = allPermission?.filter((pm) => pm.parent_id === parent.id);
			return parent;
		});
		return result;
	}

	// more query
}

module.exports = new PermissionService();
