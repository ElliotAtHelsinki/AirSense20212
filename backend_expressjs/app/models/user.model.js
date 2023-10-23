const { DataTypes, Model } = require('sequelize');

module.exports = (sequelize) => {
	class User extends Model {}

	User.init(
		{
			first_name: {
				type: DataTypes.STRING(20),
				allowNull: false,
				validate: {
					notNull: {
						msg: 'Họ không được để trống',
					},
					len: {
						args: [2, 10],
						msg: 'Đô dài tối thiếu 2 kí tự , tối đa 10 ký tự ',
					},
				},
				unique: true,
			},
			last_name: {
				type: DataTypes.STRING(50),
				allowNull: false,
				validate: {
					notNull: {
						msg: 'Tên không được để trống',
					},
					len: {
						args: [2, 50],
						msg: 'Đô dài tối thiếu 2 kí tự , tối đa 50 ký tự ',
					},
				},
			},
			phone_number: {
				type: DataTypes.STRING(20),
				validate: {
					is: {
						args: /(84|0[3|5|7|8|9])+([0-9]{8})\b/g,
						msg: 'Số điện thoại không đúng định dạng',
					},
				},
			},
			email: {
				type: DataTypes.STRING(255),
				allowNull: false,
				unique: true,
				validate: {
					notNull: {
						msg: 'Email không được để trống',
					},
					isEmail: {
						msg: 'Email không đúng định dạng',
					},
				},
			},
			password: {
				type: DataTypes.STRING(50),
				allowNull: false,
				validate: {
					notNull: {
						msg: 'Password không được để trống',
					},
					len: {
						args: [6, 50],
						msg: 'Đô dài tối thiếu 6 kí tự',
					},
				},
			},
			contact: {
				type: DataTypes.STRING(255),
			},
			avatar: {
				type: DataTypes.STRING(255),
			},
			note: {
				type: DataTypes.STRING(255),
			},
			is_active: {
				type: DataTypes.TINYINT,
				defaultValue: 0,
			},
			token: {
				type: DataTypes.STRING,
			},
			token_activate_account: {
				type: DataTypes.STRING,
			},
			token_reset_pw: {
				type: DataTypes.STRING,
			},
			gender: {
				type: DataTypes.TINYINT,
			},
			date_of_birth: {
				type: DataTypes.DATE,
				validate: {
					isDate: {
						msg: 'yêu cầu định dạng yyyy-mm-dd ',
					},
				},
			},
			created_id: {
				type: DataTypes.INTEGER,
			},
			updated_id: {
				type: DataTypes.INTEGER,
			},
			user_type_id: {
				type: DataTypes.INTEGER,
				defaultValue: 4,
			},
			system_default: {
				type: DataTypes.TINYINT,
				defaultValue: 0,
			},
		},
		{
			defaultScope: {
				where: {
					is_active: 1,
					system_default: 0,
				},
			},
			scopes: {
				active: {
					where: {
						is_active: 1,
					},
				},
				notSystemDefault: {
					where: {
						system_default: 0,
					},
				},
			},
			timestamps: true,
			paranoid: true,
			createdAt: 'created_at',
			updatedAt: 'updated_at',
			deletedAt: 'deleted_at',
			sequelize,
			modelName: 'User',
			tableName: 'user',
		},
	);
	return User;
};
