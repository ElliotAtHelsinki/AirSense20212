const AQIController = require('../controllers/aqi.controller');
const { checkPermission } = require('../middlewares/author.middleware');
const verifyToken = require('../middlewares/authen.middleware');
const { appPermissionConst } = require('../constant');
const aqiRoute = require('express').Router();

const { getAQIDaily, exportExcelData } = AQIController;

aqiRoute.get(
	'/daily',
	(req, res, next) => verifyToken(req, res, next),
	(req, res, next) => checkPermission(appPermissionConst.VIEW_AQI_LOCATION, req, res, next),
	getAQIDaily,
);
aqiRoute.post(
	'/download',
	(req, res, next) => verifyToken(req, res, next),
	(req, res, next) => checkPermission(appPermissionConst.VIEW_AQI_LOCATION, req, res, next),
	exportExcelData,
);

module.exports = aqiRoute;
