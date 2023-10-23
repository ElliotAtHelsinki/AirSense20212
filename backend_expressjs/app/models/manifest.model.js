const { DataTypes, Model } = require('sequelize');

module.exports = (sequelize) => {
	class Manifest extends Model {}

	Manifest.init(
		{
			role_name: {
				allowNull: false,
				unique: true,
				type: DataTypes.STRING(50),
				validate: {
					len: {
						args: [0, 20],
						msg: 'Tên quyền hạn có độ dài tối đa 20 ký tự',
					},
					notNull: 'tên quyền hạn không được bỏ trống',
				},
			},
			content: {
				type: DataTypes.STRING,
				validate: {
					len: {
						args: [0, 100],
						msg: 'Nội dung quyền hạn có độ dài tối đa 100 ký tự',
					},
				},
			},
			is_active: {
				type: DataTypes.TINYINT,
				defaultValue: 1,
			},
			user_type_id: {
				type: DataTypes.INTEGER,
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
			modelName: 'Manifest',
			tableName: 'manifest_authen',
		},
	);
	return Manifest;
};
