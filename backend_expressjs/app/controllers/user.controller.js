const userService = require('../services/user.service');
const BaseController = require('./base.controller');
const { handleError } = require('../services/handleError.util-service');
const jwtUtilModel = require('../models/util-model/jwt.util-model');
const { Manifest, Permission, User } = require('../models/index.model');
const { messageConst, statusCode, functionReturnCode } = require('../constant');
const md5 = require('md5');
const { sendMail, resetPassTemplate } = require('../config/mail.config');
const jwtModel = require('../models/util-model/jwt.util-model');
const { sequelize, UserRefManifest } = require('../models/index.model');
const Exception = require('../models/util-model/exception.util-model');
const { Op } = require('sequelize');
const { isEmpty, isUpdateHasNoEffect } = require('../utils');

const {
	SERVER_ERROR_CODE,
	BAD_REQUEST_CODE,
	SUCCESS_CODE,
	NOT_FOUND_CODE,
	CREATED_CODE,
	DELETED_CODE,
	NOT_AUTHEN_CODE,
	NOT_AUTHOR_CODE,
} = statusCode;
const { CATCH_ERROR, EXPIRED, NOT_FOUND, SUCCESS, VOID } = functionReturnCode;

class UserController extends BaseController {
	constructor() {
		super(userService);
	}

	// Overide method or create new
	async insert(userType, req, res, next) {
		try {
			const result = await userService.insert(userType, req, res);
			UserController.checkServiceResult(result, res, 'Thêm đối người dùng thành công');
		} catch (e) {
			handleError(e, res, User.tableName);
		}
	}

	async update(userType, req, res, next) {
		if (isNaN(req.params?.id)) {
			return res.status(BAD_REQUEST_CODE).send({ msg: messageConst.BAD_PARAMETER });
		}
		try {
			const result = await userService.update(userType, req, res);
			UserController.checkServiceResult(result, res, 'Chỉnh sửa người dùng thành công');
		} catch (e) {
			handleError(e, res, User.tableName);
		}
	}

	async updateAvatar(userType, req, res, next) {
		if (isNaN(req.params?.id)) {
			return res.status(BAD_REQUEST_CODE).send({ msg: messageConst.BAD_PARAMETER });
		}
		try {
			const result = await userService.updateSelfAvatar(req, res, next);
			if (!isUpdateHasNoEffect(result)) {
				return res.status(SUCCESS_CODE).json({ msg: messageConst.UPDATE_PASSWORD_SUCCESS });
			} else {
				return res.status(BAD_REQUEST_CODE).json({ msg: messageConst.PASSWORD_WRONG });
			}
		} catch (e) {
			handleError(e, res, User.tableName);
		}
	}

	async detail(userType, req, res, next) {
		if (isNaN(req.params?.id)) {
			return res.status(BAD_REQUEST_CODE).send({ msg: messageConst.BAD_PARAMETER });
		}
		try {
			const result = await userService.detail(userType, req.params.id);
			return res.status(statusCode.SUCCESS_CODE).json(result);
		} catch (e) {
			handleError(e, res, User.tableName);
		}
	}

	async delete(userType, req, res, next) {
		if (isNaN(req.params.id)) {
			return res.status(BAD_REQUEST_CODE).send({ msg: messageConst.BAD_PARAMETER });
		}
		try {
			await userService.delete(userType, +req.params.id);
			return res
				.status(statusCode.DELETED_CODE)
				.json({ msg: messageConst.DELETE_SUCCESS, deleted_id: req.params.id });
		} catch (e) {
			handleError(e, res, User.tableName);
		}
	}

	async search(userType, req, res, next) {
		try {
			const { size = 10, page = 1, firstName, ...rest } = req.query;
			if (isNaN(+size) || isNaN(+page)) {
				throw new Exception(messageConst.PARAMS_NUMBER_REQUIRED, messageConst.PARAMS_NUMBER_REQUIRED);
			}
			if (+page === 0) {
				res.status(statusCode.BAD_REQUEST_CODE).json({ msg: messageConst.PAGE_START_FROM_ONE });
			}
			Object.keys(rest).forEach((key) => {
				rest[key] = {
					[Op.like]: `%${rest[key]}%`,
				};
			});
			const result = await userService.search({ ...rest, user_type_id: userType }, +page, +size, req.id);
			return res.status(statusCode.SUCCESS_CODE).json(result);
		} catch (e) {
			handleError(e, res);
		}
	}

	async info(req, res, next) {
		try {
			const result = await userService.info(req.id);
			return res.status(statusCode.SUCCESS_CODE).json(result);
		} catch (e) {
			handleError(e, res);
		}
	}

	async login(req, res, next) {
		try {
			const result = await userService.login(req);
			if (result != null) {
				// A user with the specified credentials has been created in the db
				if (typeof result.id != 'undefined') {
					// User activated
					return res.status(SUCCESS_CODE).json({ data: result, token: jwtUtilModel.genKey(result) });
				} else if (typeof result.msg != 'undefined') {
					// User not activated
					return res.status(statusCode.BAD_REQUEST_CODE).json(result);
				}
			} else {
				// No user found
				return res.status(BAD_REQUEST_CODE).send({ msg: messageConst.BAD_CREDENTIAL });
			}
		} catch (e) {
			handleError(e, res);
		}
	}

	async updateSelf(req, res, next) {
		if (isNaN(req.params.id)) {
			return res.status(BAD_REQUEST_CODE).send({ msg: messageConst.BAD_PARAMETER });
		}
		if (req.body.password) {
			delete req.body.password;
		}
		try {
			const result = await userService.updateSelf(req, res);
			if (result) {
				return res.status(SUCCESS_CODE).json({ msg: messageConst.UPDATE_SUCCESS });
			} else {
				return res.status(BAD_REQUEST_CODE).json({ msg: messageConst.UPDATE_FAIL });
			}
		} catch (e) {
			handleError(e, res, User.tableName);
		}
	}

	async updateSelfAvatar(req, res, next) {
		if (isNaN(req.params.id)) {
			return res.status(BAD_REQUEST_CODE).send({ msg: messageConst.BAD_PARAMETER });
		}
		if (req.body.password) {
			delete req.body.password;
		}
		try {
			const result = await userService.updateSelfAvatar(req, res);
			if (!isUpdateHasNoEffect(result)) {
				return res.status(SUCCESS_CODE).json({ msg: messageConst.UPDATE_SUCCESS });
			} else {
				return res.status(BAD_REQUEST_CODE).json({ msg: messageConst.UPDATE_FAIL });
			}
		} catch (e) {
			handleError(e, res);
		}
	}

	async changePassword(req, res, next) {
		if (!req.body?.oldPassword || !req.body?.newPassword) {
			return res.status(BAD_REQUEST_CODE).json({ msg: messageConst.BAD_PARAMETER });
		}
		try {
			const result = await userService.updatePassword(req);
			if (!isUpdateHasNoEffect(result)) {
				return res.status(SUCCESS_CODE).json({ msg: messageConst.UPDATE_PASSWORD_SUCCESS });
			} else {
				return res.status(BAD_REQUEST_CODE).json({ msg: messageConst.PASSWORD_WRONG });
			}
		} catch (e) {
			handleError(e, res);
		}
	}

	async forgotPassword(req, res, next) {
		if (!req.body?.email) {
			return res.status(BAD_REQUEST_CODE).json({ msg: messageConst.BAD_PARAMETER });
		}
		try {
			const result = await userService.resetPassword(req);
			UserController.checkServiceResult(result, res, 'Vui lòng kiểm tra email và làm theo hướng dẫn');
		} catch (e) {
			handleError(e, res);
		}
	}

	async confirmResetPw(req, res, next) {
		try {
			const result = await userService.confirmResetPass(req);
			if (result === SUCCESS) {
				return res.redirect(process.env.APP_CLIENT_URL);
			}
			if (result === EXPIRED) {
				res.set('Content-Type', 'text/html');
				return res.send(Buffer.from('<h1>Xin lỗi phiên làm việc của bạn đã hết hạn</h1>'));
			}
			if ([NOT_FOUND, CATCH_ERROR].includes(result)) {
				res.set('Content-Type', 'text/html');
				return res.send(Buffer.from('<h1>Đã xảy ra lỗi</h1>'));
			}
		} catch (e) {
			handleError(e, res);
		}
	}

	async activate(req, res, next) {
		try {
			const result = await userService.activate(req);
			if (result === SUCCESS) {
				res.set('Content-Type', 'text/html');
				res.send(Buffer.from('<h1>Kích hoạt tài khoản thành công</h1>'));
			}
			if (result === EXPIRED) {
				res.set('Content-Type', 'text/html');
				res.send(Buffer.from('<h1>Xin lỗi phiên làm việc của bạn đã hết hạn</h1>'));
			}
			if ([NOT_FOUND, CATCH_ERROR].includes(result)) {
				res.set('Content-Type', 'text/html');
				res.send(Buffer.from('<h1>Đã xảy ra lỗi</h1>'));
			}
		} catch (e) {
			handleError(e, res);
		}
	}

	async toggleActive(userType, req, res) {
		try {
			if (!req.params.id) {
				return res.status(BAD_REQUEST_CODE).json({ msg: messageConst.BAD_PARAMETER });
			}
			const result = await userService.toggleActive(userType, req, res);
			if (!result) {
				return res.status(statusCode.NOT_FOUND_CODE).json({ msg: messageConst.NOT_FOUND });
			}
			return res.status(statusCode.CREATED_CODE).json({ msg: messageConst.UPDATE_SUCCESS });
		} catch (e) {
			handleError(e, res, this.service.tableName);
		}
	}
}

module.exports = new UserController();
