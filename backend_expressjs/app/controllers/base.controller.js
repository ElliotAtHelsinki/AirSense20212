const { handleError } = require('../services/handleError.util-service');
const { messageConst, statusCode, functionReturnCode, requestParams } = require('../constant');
const Exception = require('../models/util-model/exception.util-model');
const { sequelize, Permission } = require('../models/index.model');
const { QueryTypes } = require('sequelize');
const { Op } = require('sequelize');
const { isUpdateHasNoEffect } = require('../utils');

const { SERVER_ERROR_CODE, BAD_REQUEST_CODE, SUCCESS_CODE } = statusCode;
const {
	CATCH_ERROR,
	NOT_FOUND,
	ALREADY_CATCH_BEFORE,
	SUCCESS,
	REFERENCE_OBJ_NOT_AVAILABLE,
	REF_NOT_FOUND,
	THIRD_API_ERROR,
} = functionReturnCode;

class BaseController {
	constructor(service) {
		this.service = service;
	}

	static checkRequestPermission(userId) {
		if (isNaN(+userId)) return [];
		else {
			return sequelize.query(
				'select permission.id , permission.name from permission\n' +
					'join manifest_ref_permission mrp on permission.id = mrp.permission_id\n' +
					'join user_ref_manifest urm on mrp.manifest_id = urm.manifest_id\n' +
					'where user_id = :userId',
				{
					replacements: { userId },
					type: QueryTypes.SELECT,
					model: Permission,
					raw: true,
					nest: true,
					mapToModel: true, // pass true here if you have any mapped fields
				},
			);
		}
	}

	static checkServiceResult(result, res, successMsg) {
		if (result === ALREADY_CATCH_BEFORE) return;
		if (result === SUCCESS) {
			return res.status(SUCCESS_CODE).json({ status: 'ok', msg: successMsg || 'Thành công' });
		}
		if (result === NOT_FOUND) {
			return res.status(BAD_REQUEST_CODE).json({ msg: messageConst.NOT_FOUND });
		}
		if (result === REF_NOT_FOUND) {
			return res.status(BAD_REQUEST_CODE).json({ msg: messageConst.REF_NOT_FOUND });
		}
		if (result === CATCH_ERROR) {
			return res.status(SERVER_ERROR_CODE).json({ msg: messageConst.SERVER_ERROR });
		}
		if (result === THIRD_API_ERROR) {
			return res.status(SERVER_ERROR_CODE).json({ msg: messageConst.THIRD_API_ERROR });
		}
		if (result === REFERENCE_OBJ_NOT_AVAILABLE) {
			return res.status(SUCCESS_CODE).json({
				status: 'ok',
				msg: successMsg + '\n Warning : các obj reference không thỏa mãn đã tự động được loại bỏ',
			});
		}
		if (isNaN(result)) {
			return res.status(BAD_REQUEST_CODE).json({ msg: result + ' required' });
		} else {
			return res.status(204).json({});
		}
	}

	async search(req, res, next) {
		try {
			const { size = 10, page = 1, ...rest } = req.query;
			if (isNaN(+size) || isNaN(+page)) {
				throw new Exception(messageConst.PARAMS_NUMBER_REQUIRED, messageConst.PARAMS_NUMBER_REQUIRED);
			}
			if (+page === 0) {
				res.status(statusCode.BAD_REQUEST_CODE).json({ msg: messageConst.PAGE_START_FROM_ONE });
			}
			Object.keys(rest).forEach((key) => {
				if (rest[key] === requestParams.UNSET) rest[key] = null;
				else {
					rest[key] = {
						[Op.like]: `%${rest[key]}%`,
					};
				}
			});
			const result = await this.service.search({ ...rest }, +page, +size);
			return res.status(statusCode.SUCCESS_CODE).json(result);
		} catch (e) {
			handleError(e, res);
		}
	}

	async detail(req, res, next) {
		try {
			const result = await this.service.detail(req.params.id);
			return res.status(statusCode.SUCCESS_CODE).json(result);
		} catch (e) {
			handleError(e, res, this.service.tableName);
		}
	}

	async insert(req, res, next) {
		try {
			if (req.id) {
				req.body.created_id = req.id;
			}
			const createdModel = await this.service.insert(req.body);
			return res
				.status(statusCode.CREATED_CODE)
				.json({ msg: messageConst.INSERT_SUCCESS, content: createdModel });
		} catch (e) {
			handleError(e, res, this.service.tableName);
		}
	}

	async batchInsert(req, res, next) {
		try {
			await this.service.batchInsert(req.body);
			return res.status(statusCode.CREATED_CODE).json({ msg: messageConst.BATCH_INSERT_SUCCESS });
		} catch (e) {
			handleError(e, res, this.service.tableName);
		}
	}

	async update(req, res, next) {
		try {
			if (req.id) {
				req.body.updated_id = req.id;
			}
			const result = await this.service.update(req.body, { id: req.params.id });
			if (!isUpdateHasNoEffect(result)) {
				return res.status(statusCode.CREATED_CODE).json({ msg: messageConst.UPDATE_SUCCESS });
			} else {
				return res.status(BAD_REQUEST_CODE).json({ msg: messageConst.NOT_FOUND });
			}
		} catch (e) {
			handleError(e, res, this.service.tableName);
		}
	}

	async toggleActive(req, res, next) {
		try {
			const result = await this.service.toggleActive(req.params.id);
			if (!result) {
				return res.status(statusCode.NOT_FOUND_CODE).json({ msg: messageConst.NOT_FOUND });
			}

			return res.status(statusCode.CREATED_CODE).json({ msg: messageConst.UPDATE_SUCCESS });
		} catch (e) {
			handleError(e, res, this.service.tableName);
		}
	}

	async delete(req, res, next) {
		try {
			const result = await this.service.delete({ id: req.params.id });
			if (result) {
				return res
					.status(statusCode.DELETED_CODE)
					.json({ msg: messageConst.DELETE_SUCCESS, deleted_id: req.params.id });
			} else {
				return res.status(BAD_REQUEST_CODE).json({ msg: messageConst.NOT_FOUND });
			}
		} catch (e) {
			handleError(e, res, this.service.tableName);
		}
	}
}

module.exports = BaseController;
