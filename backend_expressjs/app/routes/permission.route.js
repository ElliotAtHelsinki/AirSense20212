const permissionController = require('../controllers/permission.controller');
const permissionRoute = require('express').Router();

const router = require('./base.route')(permissionRoute, permissionController, {
	detail: {
		isHide: true,
	},
	search: {
		isHide: false,
	},
	insert: {
		isHide: true,
	},
	batchInsert: {
		isHide: true,
	},
	update: {
		isHide: true,
	},
	toggleActive: {
		isHide: true,
	},
	delete: {
		isHide: true,
	},
});
// more router here
module.exports = router;
