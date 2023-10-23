const { DataTypes, Model } = require('sequelize');

module.exports = (sequelize) => {
	class UserType extends Model {}

	UserType.init(
		{
			name: {
				allowNull: false,
				type: DataTypes.STRING(),
			},
			vi_name: DataTypes.STRING(),
			is_active: DataTypes.TINYINT(),
		},
		{
			defaultScope: {
				where: {
					is_active: 1,
				},
			},
			scopes: {
				active: {
					where: {
						is_active: 1,
					},
				},
			},
			timestamps: true,
			paranoid: true,
			createdAt: 'created_at',
			updatedAt: 'updated_at',
			deletedAt: 'deleted_at',
			sequelize,
			modelName: 'UserType',
			tableName: 'user_type',
		},
	);
	return UserType;
};
