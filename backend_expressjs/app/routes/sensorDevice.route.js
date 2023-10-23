const sensorDeviceController = require('../controllers/sensorDevice.controller');
const { checkPermission } = require('../middlewares/author.middleware');
const verifyToken = require('../middlewares/authen.middleware');
const { appPermissionConst } = require('../constant');
const sensorDeviceRoute = require('express').Router();

const router = require('./base.route')(sensorDeviceRoute, sensorDeviceController, {
	detail: {
		isHide: false,
		permission: appPermissionConst.DETAIL_SENSOR_DEVICE,
	},
	search: {
		isHide: false,
		permission: appPermissionConst.SEARCH_SENSOR_DEVICE,
	},
	insert: {
		isHide: false,
		permission: appPermissionConst.CREATE_SENSOR_DEVICE,
	},
	update: {
		isHide: false,
		permission: appPermissionConst.UPDATE_SENSOR_DEVICE,
	},
	toggleActive: {
		isHide: true,
		permission: appPermissionConst.ACTIVE_SENSOR_DEVICE,
	},
	delete: {
		isHide: false,
		permission: appPermissionConst.DELETE_SENSOR_DEVICE,
	},
});
router.put(
	'/toggle-active/:id/:type',
	(req, res, next) => verifyToken(req, res, next),
	(req, res, next) => checkPermission(appPermissionConst.ACTIVE_SENSOR_DEVICE, req, res, next),
	(req, res, next) => sensorDeviceController.toggleActive(req, res, next),
);
module.exports = router;
