const { DataTypes, Model } = require('sequelize');

module.exports = (sequelize) => {
	class Permission extends Model {}

	Permission.init(
		{
			name: DataTypes.STRING(50),
			vi_name: DataTypes.STRING(100),
			parent_id: DataTypes.INTEGER(),
		},
		{
			timestamps: true,
			paranoid: true,
			createdAt: 'created_at',
			updatedAt: 'updated_at',
			deletedAt: 'deleted_at',
			sequelize,
			modelName: 'Permission',
			tableName: 'permission',
		},
	);
	return Permission;
};
