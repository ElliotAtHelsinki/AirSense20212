const ManifestController = require('../controllers/manifest.controller');
const { checkPermission } = require('../middlewares/author.middleware');
const verifyToken = require('../middlewares/authen.middleware');
const { appPermissionConst } = require('../constant');
const manifestRoute = require('express').Router();

const router = require('./base.route')(manifestRoute, ManifestController, {
	detail: {
		isHide: false,
		permission: appPermissionConst.DETAIL_MANIFEST,
	},
	search: {
		isHide: false,
		permission: appPermissionConst.SEARCH_MANIFEST,
	},
	insert: {
		isHide: true,
		permission: appPermissionConst.CREATE_MANIFEST,
	},
	// batchInsert: {
	// 	isHide: true,
	// 	permission: '',
	// },
	update: {
		isHide: true,
		permission: appPermissionConst.UPDATE_MANIFEST,
	},
	toggleActive: {
		isHide: false,
		permission: appPermissionConst.ACTIVE_MANIFEST,
	},
	delete: {
		isHide: false,
		permission: appPermissionConst.DELETE_MANIFEST,
	},
});
manifestRoute.post(
	'/insert',
	(req, res, next) => verifyToken(req, res, next),
	(req, res, next) => checkPermission(appPermissionConst.CREATE_MANIFEST, req, res, next),
	(req, res, next) => ManifestController.insert(req, res, next),
);
manifestRoute.put(
	'/update/:id',
	(req, res, next) => verifyToken(req, res, next),
	(req, res, next) => checkPermission(appPermissionConst.UPDATE_MANIFEST, req, res, next),
	(req, res, next) => ManifestController.update(req, res, next),
);

module.exports = router;
