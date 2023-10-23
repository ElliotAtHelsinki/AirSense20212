const LocationController = require('../controllers/location.controller');
const { checkPermission } = require('../middlewares/author.middleware');
const verifyToken = require('../middlewares/authen.middleware');
const { appPermissionConst } = require('../constant');
const locationRoute = require('express').Router();

const router = require('./base.route')(locationRoute, LocationController, {
	detail: {
		isHide: false,
		permission: appPermissionConst.DETAIL_LOCATION,
	},
	search: {
		isHide: false,
		permission: appPermissionConst.SEARCH_LOCATION,
	},
	insert: {
		isHide: false,
		permission: appPermissionConst.CREATE_LOCATION,
	},
	update: {
		isHide: false,
		permission: appPermissionConst.UPDATE_LOCATION,
	},
	toggleActive: {
		isHide: true,
	},
	delete: {
		isHide: false,
		permission: appPermissionConst.DELETE_LOCATION,
	},
});
router.put(
	'/change-status/:id',
	(req, res, next) => verifyToken(req, res, next),
	(req, res, next) => checkPermission(appPermissionConst.CHANGE_STATUS_LOCATION, req, res, next),
	(req, res, next) => LocationController.changeStatus(req, res, next),
);
module.exports = router;
