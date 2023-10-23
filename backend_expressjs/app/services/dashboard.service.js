const { sequelize } = require('../models/index.model');
const { QueryTypes } = require('sequelize');

class DashboardService {
	getOverviewUser(req) {
		return sequelize
			.query(
				'select count(*) as total ,\n' +
					'(select count(*) from user where user_type_id =1) as number_admin,\n' +
					'(select count(*) from user where user_type_id =2) as number_teacher,\n' +
					'(select count(*) from user where user_type_id =3) as number_blogger,\n' +
					'(select count(*) from user where user_type_id =4) as number_customer,\n' +
					'(select count(*) from user where user_type_id =5) as number_sensor_admin,\n' +
					'(select count(*) from user where WEEK(created_at,0) = WEEK(current_date(),0)   - 1)  as createdLastWeek,\n' +
					'(select count(*) from user where WEEK(created_at,0) = WEEK(current_date(),0)   - 1 and deleted_at is not null ) as removedLastWeek\n' +
					'from user;',
				{
					type: QueryTypes.SELECT,
					raw: true,
				},
			)
			.then((res) => {
				if (res.length) return res[0];
				return [];
			});
	}

	getOverviewLocation(req) {
		return sequelize
			.query(
				'select count(*) as total,\n' +
					'(select count(*) from location where status = 1) as number_testing,\n' +
					'(select count(*) from location where status =2) as number_active,\n' +
					'(select count(*) from location where status =3) as number_deActive,\n' +
					'(select count(*) from location where WEEK(created_at,0) = WEEK(current_date(),0)   - 1)  as createdLastWeek,\n' +
					'(select count(*) from location where WEEK(created_at,0) = WEEK(current_date(),0)   - 1 and deleted_at is not null )  as removedLastWeek\n' +
					'from location;',
				{
					type: QueryTypes.SELECT,
					raw: true,
				},
			)
			.then((res) => {
				if (res.length) return res[0];
				return [];
			});
	}

	getOverviewSensor(req) {
		return sequelize
			.query(
				'' +
					'select count(*) as total ,\n' +
					'(select count(*) from sensor_device where location_id is not null ) as number_has_location,\n' +
					'(select count(*) from sensor_device where location_id is null ) as number_idle,\n' +
					'(select count(*) from sensor_device where WEEK(created_at,0) = WEEK(current_date(),0)   - 1)  as createdLastWeek,\n' +
					'(select count(*) from sensor_device where WEEK(created_at,0) = WEEK(current_date(),0)   - 1 and deleted_at is not null ) as removedLastWeek\n' +
					'from sensor_device;',
				{
					type: QueryTypes.SELECT,

					raw: true,
				},
			)
			.then((res) => {
				if (res.length) return res[0];
				return [];
			});
	}

	getOverviewAqi(req) {}
}

module.exports = new DashboardService();
