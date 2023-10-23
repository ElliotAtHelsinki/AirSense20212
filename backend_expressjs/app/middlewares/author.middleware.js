const { messageConst, statusCode } = require('../constant');
const BaseController = require('../controllers/base.controller');

async function checkPermission(permissionRequired, req, res, next) {
	if (req.isOwner) {
		next();
	} else {
		try {
			const listPermission = await BaseController.checkRequestPermission(req.id);
			if (
				listPermission.map((permission) => permission.name).includes(permissionRequired) ||
				!permissionRequired
			) {
				next();
			} else res.status(statusCode.NOT_AUTHOR_CODE).json({ msg: messageConst.PERMISSION_DENIED });
		} catch (e) {
			res.status(statusCode.SERVER_ERROR_CODE).json({ msg: messageConst.SERVER_ERROR });
		}
	}
}

async function checkResourceOwner(req, res, next, isRequired) {
	if (+req.params.id === req.id) {
		req.isOwner = true;
		next();
	} else {
		if (isRequired) {
			res.status(statusCode.NOT_AUTHOR_CODE).json({ msg: messageConst.NO_AUTHORIZE });
			return;
		}
		next();
	}
}

module.exports = {
	checkPermission,
	checkResourceOwner,
};
