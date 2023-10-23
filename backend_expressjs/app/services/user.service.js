const { User, sequelize, Manifest, Permission, UserType } = require('../models/index.model');
const BaseService = require('./base.service');
const md5 = require('md5');
const jwtModel = require('../models/util-model/jwt.util-model');
const { sendMail, parseResetPassTemplate, parseActivateAccountTemplate } = require('../config/mail.config');
const { v4 } = require('uuid');
const { functionReturnCode, statusCode, messageConst } = require('../constant');
const { Op } = require('sequelize');
const { handleError } = require('./handleError.util-service');

class UserService extends BaseService {
	constructor() {
		super(User);
	}

	async insert(userType, req, res) {
		const t = await sequelize.transaction();
		const hashed = md5(req.body?.password);
		try {
			const user = { ...req.body, password: hashed };
			if (!userType) {
				return functionReturnCode.REF_NOT_FOUND;
			}
			user.user_type_id = userType;
			delete user.manifests;
			delete user.system_default;
			if (req.id) {
				user.created_id = req.id;
			}
			const createdUser = await User.create(user, { transaction: t });
			if (req.body.manifests) {
				const listManifest = await Manifest.scope(null).findAll({
					where: {
						id: {
							[Op.in]: req.body.manifests || [],
						},
						user_type_id: createdUser.user_type_id,
					},
				});
				createdUser.setManifests(listManifest);
			}
			if (!createdUser.is_active) {
				const activateToken = jwtModel.genKeyActivateAccount(createdUser);
				await createdUser.update(
					{
						...createdUser,
						token_activate_account: activateToken,
					},
					{
						transaction: t,
					},
				);
				const baseURL =
					process.env.STATUS === 'development' ? 'http://localhost:3001' : process.env.APP_SERVER_URL;
				const mailContent = await parseActivateAccountTemplate(`${baseURL}/user/activate/${activateToken}`);
				try {
					await sendMail(user.email, 'Kích hoạt tài khoản', mailContent);
				} catch (e) {
					await t.rollback();
					return functionReturnCode.THIRD_API_ERROR;
				}
			}

			await t.commit();
			return functionReturnCode.SUCCESS;
		} catch (e) {
			await t.rollback();
			handleError(e, res, User.tableName);
			return functionReturnCode.ALREADY_CATCH_BEFORE;
		}
	}

	async update(userType, req, res) {
		const t = await sequelize.transaction();
		if (!userType) {
			return functionReturnCode.REF_NOT_FOUND;
		}
		try {
			const user = { ...req.body };
			delete user.manifests;
			delete user.password;
			delete user.email;
			delete user.user_type_id;
			delete user.system_default;
			if (req.id) {
				user.updated_id = +req.id;
			}
			// cho phep update ca user ko active
			const oldUser = await User.scope('notSystemDefault').findByPk(req.params.id, {
				where: { user_type_id: +userType },
			});
			if (!oldUser) {
				await t.rollback();
				return functionReturnCode.NOT_FOUND;
			}
			await User.scope(null).update(
				{ ...user },
				{
					where: {
						id: +req.params.id,
					},
					transaction: t,
				},
			);
			if (req.body.manifests) {
				const updatedUser = await User.scope(null).findByPk(req.params.id);
				const manifests = await Manifest.scope(null).findAll({
					where: {
						id: {
							[Op.in]: req.body.manifests || [],
						},
						user_type_id: userType,
					},
				});
				updatedUser.setManifests(manifests);
			}
			await t.commit();
			return functionReturnCode.SUCCESS;
		} catch (e) {
			await t.rollback();
			handleError(e, res, User.tableName);
			return functionReturnCode.ALREADY_CATCH_BEFORE;
		}
	}

	async updateSelf(req, res) {
		const user = { ...req.body };
		delete user.manifests;
		delete user.password;
		delete user.email;
		delete user.user_type_id;
		delete user.system_default;
		return User.scope(null).update(user, { where: { id: +req.params.id } });
	}

	async updateSelfAvatar(req, res) {
		const avatar = req.file.location;
		return User.scope(null).update({ avatar }, { where: { id: +req.params.id } });
	}

	async detail(userType, id) {
		return User.scope(null).findOne({
			where: { id: +id, user_type_id: +userType },
			attributes: {
				exclude: ['token', 'token_reset_pw', 'token_activate_account', 'password', 'deleted_at'],
			},
			include: [
				{
					model: Manifest.scope('active'),
					required: false,
					attributes: ['id', 'role_name', 'content'],
					include: {
						model: Permission,
						required: false,
						attributes: ['id', 'name'],
						through: {
							attributes: [],
						},
					},
					through: {
						attributes: [],
					},
				},
				{
					model: UserType,
					required: false,
					attributes: ['name', 'vi_name'],
				},
			],
		});
	}

	async delete(userType, id) {
		return User.scope(null).destroy({ where: { id: +id, user_type_id: +userType } });
	}

	search(options, page = 1, size = 10, userId) {
		return User.scope(null).findAndCountAll({
			where: { ...options, id: { [Op.ne]: +userId || -1 } },
			offset: (+page - 1) * size,
			limit: size,
			order: [['updated_at', 'ASC']],
			attributes: { exclude: ['token', 'token_reset_pw', 'token_activate_account', 'password', 'deleted_at'] },
		});
	}

	async login(req) {
		const user = await User.scope(null).findOne({
			where: { email: req.body?.email, password: md5(req.body?.password) },
			attributes: { exclude: ['token', 'token_reset_pw', 'token_activate_account', 'password', 'deleted_at'] },
			include: {
				model: Manifest.scope(null),
				required: false,
				attributes: ['id', 'role_name', 'content'],
				include: {
					model: Permission,
					required: false,
					attributes: ['id', 'name', 'vi_name'],
					through: {
						attributes: [],
					},
				},
				through: {
					attributes: [],
				},
			},
		});
		if (user) {
			if (user.is_active == 0) {
				return {
					msg: 'Tài khoản chưa kích hoạt.',
				};
			}
			return user;
		}
		return null;
	}

	async info(id) {
		return User.scope(null).findOne({
			where: { id: +id },
			attributes: {
				exclude: ['token', 'token_reset_pw', 'token_activate_account', 'password', 'deleted_at', 'is_active'],
			},
			include: [
				{
					model: Manifest.scope(['active']),
					required: false,
					attributes: ['id', 'role_name', 'content'],
					include: {
						model: Permission,
						required: false,
						attributes: ['id', 'name', 'vi_name'],
						through: {
							attributes: [],
						},
					},
					through: {
						attributes: [],
					},
				},
				{
					model: UserType,
					required: false,
					attributes: ['name', 'vi_name'],
				},
			],
		});
	}

	async updatePassword(req) {
		const id = req.id;
		const user = await User.scope(null).findOne({
			where: {
				id,
				password: md5(req.body?.oldPassword),
			},
		});
		if (user) {
			return User.scope(null).update({ ...user, password: md5(req.body?.newPassword) }, { where: { id } });
		} else return [0];
	}

	async resetPassword(req) {
		const { email } = req.body;
		const user = await User.scope(null).findOne({ where: { email } });
		if (user) {
			const passWordReset = v4();
			const tokenReset = jwtModel.genKeyResetPass(user, passWordReset);
			try {
				await User.scope(null).update({ ...user, token_reset_pw: tokenReset }, { where: { id: user.id } });
				const mailContent = await parseResetPassTemplate(
					`${
						process.env.STATUS === 'development' ? 'http://localhost:3001' : process.env.APP_SERVER_URL
					}/user/reset-password/${tokenReset}`,
					passWordReset,
				);
				try {
					await sendMail(email, 'Xác nhận sử dụng tính năng quên mật khẩu', mailContent);
				} catch (e) {
					return functionReturnCode.THIRD_API_ERROR;
				}
				return functionReturnCode.SUCCESS;
			} catch (e) {
				console.log(e);
				return functionReturnCode.CATCH_ERROR;
			}
		} else {
			return functionReturnCode.NOT_FOUND;
		}
	}

	async confirmResetPass(req) {
		const { tokenReset } = req.params;
		const { newPass, exp, id } = await jwtModel.verify(tokenReset);
		if (new Date().getTime() / 1000 > exp) {
			return functionReturnCode.EXPIRED;
		}
		const user = await User.scope(null).findOne({ token_reset_pw: tokenReset, id: +id });
		if (!user) {
			return functionReturnCode.NOT_FOUND;
		} else {
			try {
				User.scope(null).update({ password: md5(newPass) }, { id: +id });
				return functionReturnCode.SUCCESS;
			} catch (e) {
				return functionReturnCode.CATCH_ERROR;
			}
		}
	}

	async toggleActive(userType, req, res) {
		const modelObj = await User.scope(null).findByPk(req.params.id);
		if (!modelObj) return null;
		return User.scope(null).update(
			{ is_active: ((modelObj.is_active || 0) + 1) % 2, token_activate_account: null },
			{ where: { id: req.params.id } },
		);
	}

	async activate(req) {
		const { activateToken } = req.params;
		const { exp } = await jwtModel.verify(activateToken);
		if (new Date().getTime() / 1000 > exp) {
			return functionReturnCode.EXPIRED;
		}
		const user = await User.scope(null).findOne({
			where: {
				token_activate_account: activateToken,
			},
		});
		if (!user) {
			return functionReturnCode.NOT_FOUND;
		} else {
			try {
				await user.update({ is_active: 1, token_activate_account: null });
				return functionReturnCode.SUCCESS;
			} catch (e) {
				return functionReturnCode.CATCH_ERROR;
			}
		}
	}
}

module.exports = new UserService();
