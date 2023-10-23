const userRouter = require('./user.route');
const manifestRouter = require('./manifest.route');
const permissionRouter = require('./permission.route');
const userTypeRouter = require('./userType.route');
const locationRouter = require('./location.route');
const sensorDeviceRouter = require('./sensorDevice.route');
const dashboardRouter = require('./dashboard.route');
const webExpose = require('./webExpose.route');
const aqiRouter = require('./aqi.route');
const deviceTypeRouter = require('./deviceType.route');

const { appUserTypeConst, appPermissionConst } = require('../constant');
const { s3Upload } = require('../config/s3.config');
const authenMiddle = require('../middlewares/authen.middleware');
const userAdminRouterRaw = require('express').Router();
const userAdminLocationRouterRaw = require('express').Router();
const userCustomerRouterRaw = require('express').Router();

const userAdminRouter = require('./admin.route')(userAdminRouterRaw, {
	insert: {
		permission: appPermissionConst.CREATE_ADMIN,
		userType: appUserTypeConst.admin,
	},
	update: {
		permission: appPermissionConst.UPDATE_ADMIN,
		userType: appUserTypeConst.admin,
	},
	toggleActive: {
		permission: appPermissionConst.ACTIVE_ADMIN,
		userType: appUserTypeConst.admin,
	},
	delete: {
		permission: appPermissionConst.DELETE_ADMIN,
		userType: appUserTypeConst.admin,
	},
	detail: {
		permission: appPermissionConst.DETAIL_ADMIN,
		userType: appUserTypeConst.admin,
	},
	search: {
		permission: appPermissionConst.SEARCH_ADMIN,
		userType: appUserTypeConst.admin,
	},
});
const userAdminLocationRouter = require('./admin.route')(userAdminLocationRouterRaw, {
	insert: {
		permission: appPermissionConst.CREATE_ADMIN_LOCATION,
		userType: appUserTypeConst.adminLocation,
	},
	update: {
		permission: appPermissionConst.UPDATE_ADMIN_LOCATION,
		userType: appUserTypeConst.adminLocation,
	},
	toggleActive: {
		permission: appPermissionConst.ACTIVE_ADMIN_LOCATION,
		userType: appUserTypeConst.adminLocation,
	},
	delete: {
		permission: appPermissionConst.DELETE_ADMIN_LOCATION,
		userType: appUserTypeConst.adminLocation,
	},
	detail: {
		permission: appPermissionConst.DETAIL_ADMIN_LOCATION,
		userType: appUserTypeConst.adminLocation,
	},
	search: {
		permission: appPermissionConst.SEARCH_ADMIN_LOCATION,
		userType: appUserTypeConst.adminLocation,
	},
});
const userCustomerRoute = require('./admin.route')(userCustomerRouterRaw, {
	insert: {
		permission: appPermissionConst.CREATE_CUSTOMER,
		userType: appUserTypeConst.customer,
	},
	update: {
		permission: appPermissionConst.UPDATE_CUSTOMER,
		userType: appUserTypeConst.customer,
	},
	toggleActive: {
		permission: appPermissionConst.ACTIVE_CUSTOMER,
		userType: appUserTypeConst.admin,
	},
	delete: {
		permission: appPermissionConst.DELETE_CUSTOMER,
		userType: appUserTypeConst.customer,
	},
	detail: {
		permission: appPermissionConst.DETAIL_CUSTOMER,
		userType: appUserTypeConst.customer,
	},
	search: {
		permission: appPermissionConst.SEARCH_CUSTOMER,
		userType: appUserTypeConst.customer,
	},
});

const allAppRoute = (app) => {
	app.use('/admin', userAdminRouter);
	app.use('/customer', userCustomerRoute);
	app.use('/adminLocation', userAdminLocationRouter);
	app.use('/app-userType', userTypeRouter);
	app.use('/user', userRouter);
	app.use('/manifest', manifestRouter);
	app.use('/permission', permissionRouter);
	app.use('/location', locationRouter);
	app.use('/sensor', sensorDeviceRouter);
	app.use('/overview', dashboardRouter);
	app.use('/device-type', deviceTypeRouter);
	app.use('/aqi', aqiRouter);
	app.use('/webExpose', webExpose);

	app.post(
		'/upload-image',
		(req, res, next) => authenMiddle(req, res, next),
		s3Upload.single('file'),
		(req, res, next) => {
			if (!req?.file?.location) {
				res.status(500).json({
					message: 'Upload failed!',
				});
			}
			res.status(200).json({
				message: 'Uploaded!',
				urls: req?.file?.location,
			});
		},
	);
};

module.exports = { allAppRoute };
