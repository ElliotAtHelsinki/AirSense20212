const { Manifest, UserType, Permission, sequelize } = require('../models/index.model');
const BaseService = require('./base.service');
const { functionReturnCode, statusCode } = require('../constant');
const { handleError } = require('./handleError.util-service');
const { Op } = require('sequelize');

class ManifestService extends BaseService {
	constructor() {
		super(Manifest);
	}

	async search(rest /* object like {id : 1}*/, page = 1, size = 10) {
		return Manifest.scope('notSystemDefault').findAndCountAll({
			where: rest,
			offset: (+page - 1) * size,
			limit: size,
			order: [['updated_at', 'ASC']],
		});
	}

	async detail(id) {
		return Manifest.scope(null).findByPk(id, {
			include: [
				{
					model: UserType,
					attributes: { exclude: ['deleted_at', 'created_at', 'updated_at'] },
				},
				{
					model: Permission,
					required: false,
					attributes: ['id', 'name', 'vi_name', 'parent_id'],
					through: {
						attributes: [],
					},
				},
			],
		});
	}

	async insert(req, res) {
		if (!req.body.user_type_id) {
			return functionReturnCode.PARAM_REQUIRED('user_type_id');
		}
		// if (!req.body.permissions) {
		// 	return functionReturnCode.PARAM_REQUIRED('permissions');
		// }
		if (req.body.is_active !== 1) {
			req.body.is_active = 0;
		}
		const t = await sequelize.transaction();

		try {
			const manifestObj = { ...req.body };
			delete manifestObj.permissions;
			delete manifestObj.system_default;
			if (req.id) {
				manifestObj.created_id = req.id;
			}
			const createdManifest = await Manifest.create(manifestObj, { transaction: t });
			const userType = await UserType.findByPk(req.body.user_type_id);
			const arrPermission = req.body.permissions
				? await Permission.findAll({
						where: {
							id: {
								[Op.in]: req.body.permissions,
							},
						},
				  })
				: [];
			createdManifest.setUserType(userType);
			if (arrPermission.length > 0) createdManifest.setPermissions(arrPermission);
			await t.commit();
			return functionReturnCode.SUCCESS;
		} catch (e) {
			await t.rollback();
			handleError(e, res, Manifest.tableName);
			return functionReturnCode.ALREADY_CATCH_BEFORE;
		}
	}

	async update(req, res) {
		if (!req.body.user_type_id) {
			return functionReturnCode.PARAM_REQUIRED('user_type_id');
		}
		// if (!req.body.permissions) {
		// 	return functionReturnCode.PARAM_REQUIRED('permissions');
		// }
		if (req.body.is_active !== 1) {
			req.body.is_active = 0;
		}
		if (req.system_default === 1) {
			res.status(statusCode.NOT_AUTHOR_CODE).json({ msg: 'Không được phép thay đổi quyền hạn superAdmin' });
		}
		const t = await sequelize.transaction();
		try {
			const oldManifest = await Manifest.scope(null).findByPk(req.params.id);
			if (!oldManifest) {
				await t.rollback();
				return functionReturnCode.NOT_FOUND;
			}
			const manifestObj = { ...req.body };
			delete manifestObj.permissions;
			if (req.id) {
				manifestObj.updated_id = req.id;
			}
			await Manifest.update(manifestObj, {
				where: {
					id: +req.params.id,
				},
				transaction: t,
			});
			const updatedManifest = await Manifest.findByPk(+req.params.id);
			const userType = await UserType.findByPk(req.body.user_type_id);
			const arrPermission = await Permission.findAll({
				where: {
					id: {
						[Op.in]: req.body.permissions,
					},
				},
			});
			updatedManifest.setUserType(userType);
			updatedManifest.setPermissions(arrPermission);
			await t.commit();
			return functionReturnCode.SUCCESS;
		} catch (e) {
			await t.rollback();
			handleError(e, res, Manifest.tableName);
			return functionReturnCode.ALREADY_CATCH_BEFORE;
		}
	}
}

module.exports = new ManifestService();
