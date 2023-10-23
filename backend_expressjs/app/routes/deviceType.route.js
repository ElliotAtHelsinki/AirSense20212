const sensorDeviceTypeController = require('../controllers/sensorDeviceType.controller');
const { checkPermission } = require('../middlewares/author.middleware');
const verifyToken = require('../middlewares/authen.middleware');
const { appPermissionConst } = require('../constant');
const sensorDeviceTypeRoute = require('express').Router();

const router = require('./base.route')(sensorDeviceTypeRoute, sensorDeviceTypeController, {
	detail: {
		isHide: false,
		permission: appPermissionConst.DETAIL_SENSOR_TYPE,
	},
	search: {
		isHide: false,
		permission: appPermissionConst.SEARCH_SENSOR_TYPE,
	},
	insert: {
		isHide: false,
		permission: appPermissionConst.CREATE_SENSOR_TYPE,
	},
	update: {
		isHide: false,
		permission: appPermissionConst.UPDATE_SENSOR_TYPE,
	},
	toggleActive: {
		isHide: true,
		permission: appPermissionConst.ACTIVE_SENSOR_DEVICE,
	},
	delete: {
		isHide: false,
		permission: appPermissionConst.DELETE_SENSOR_TYPE,
	},
});

module.exports = router;
