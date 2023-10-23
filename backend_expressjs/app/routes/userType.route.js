const userTypeController = require('../controllers/userType.controller');

const userTypeRoute = require('express').Router();

const router = require('./base.route')(userTypeRoute, userTypeController, {
	detail: {
		isHide: true,
	},
	search: {
		isHide: false,
		permission: '',
	},
	insert: {
		isHide: true,
		permission: '',
	},
	batchInsert: {
		isHide: true,
		permission: '',
	},
	update: {
		isHide: true,
		permission: '',
	},
	toggleActive: {
		isHide: true,
		permission: '',
	},
	delete: {
		isHide: true,
		permission: '',
	},
});

module.exports = router;
