const { DataTypes, Model } = require('sequelize');

module.exports = (sequelize) => {
	class SensorDeviceType extends Model {}

	SensorDeviceType.init(
		{
			type_name: {
				type: DataTypes.STRING,
				unique: true,
				allowNull: false,
				validate: {
					notNull: 'Tên loại thiết bị không được bỏ trống',
				},
			},
			description: {
				type: DataTypes.TEXT,
			},
			created_id: {
				type: DataTypes.INTEGER,
			},
			updated_id: {
				type: DataTypes.INTEGER,
			},
			system_default: {
				type: DataTypes.TINYINT,
				defaultValue: 0,
			},
		},
		{
			timestamps: true,
			// paranoid: true,
			createdAt: 'created_at',
			updatedAt: 'updated_at',
			deletedAt: 'deleted_at',
			sequelize,
			modelName: 'SensorDeviceType',
			tableName: 'sensor_device_type',
		},
	);
	return SensorDeviceType;
};
