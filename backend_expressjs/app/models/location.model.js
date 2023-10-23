const { DataTypes, Model } = require('sequelize');

module.exports = (sequelize) => {
	class Location extends Model {}

	Location.init(
		{
			location_name: {
				allowNull: false,
				type: DataTypes.STRING(255),
				unique: true,
				validate: {
					len: {
						args: [0, 255],
						msg: 'Tên địa điểm có độ dài tối đa 255 ký tự',
					},
					notNull: 'Tên địa điểm không được bỏ trống',
				},
			},
			latitude: {
				type: DataTypes.FLOAT(8, 5),
			},
			longitude: {
				type: DataTypes.FLOAT(8, 5),
			},
			avatar: {
				type: DataTypes.STRING(255),
			},
			description: {
				type: DataTypes.TEXT,
			},
			contact: {
				type: DataTypes.STRING(255),
			},
			address: {
				type: DataTypes.STRING(255),
			},
			status: {
				type: DataTypes.INTEGER,
				defaultValue: 1,
				validate: {
					isIn: {
						args: [[1, 2, 3]],
						msg: 'Trạng thái là 1: thử nghiệm , 2 : hoạt động  hoặc 3 : ngừng hoạt động',
					},
				},
			},
			testing_date: {
				type: DataTypes.DATE,
			},
			created_id: {
				type: DataTypes.INTEGER,
			},
			updated_id: {
				type: DataTypes.INTEGER,
			},
		},
		{
			validate: {
				bothCoordsOrNone() {
					if ((this.latitude === null) !== (this.longitude === null)) {
						throw new Error('Either both latitude and longitude, or neither!');
					}
				},
			},
			timestamps: true,
			paranoid: true,
			createdAt: 'created_at',
			updatedAt: 'updated_at',
			deletedAt: 'deleted_at',
			sequelize,
			modelName: 'Location',
			tableName: 'location',
		},
	);
	return Location;
};
