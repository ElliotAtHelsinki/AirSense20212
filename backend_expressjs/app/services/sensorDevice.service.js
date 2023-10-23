const { SensorDevice, SensorDeviceType, Location, sequelize } = require('../models/index.model');
const BaseService = require('./base.service');
const { functionReturnCode } = require('../constant');
const { handleError } = require('./handleError.util-service');
const fetch = require('node-fetch');

const APP_SENSOR_TYPE_DEFAULT = {
	CORE: 'REQUEST_SETUP_STATUS',
	ALARM: 'REQUEST_SETUP_ALARM',
	PUMP: 'REQUEST_SETUP_PUMP',
};

const MQTT_SERVER_ENDPOINT =
	process.env.STATUS === 'development' ? 'http://localhost:3002' : process.env.MQTT_SERVER_URL;

// const MQTT_SERVER_ENDPOINT = 'http://localhost:3002';

class SensorDeviceService extends BaseService {
	constructor() {
		super(SensorDevice);
	}

	async toggleActive(macId, type) {
		const modelObj = await SensorDevice.scope(null).findOne({
			where: {
				macId,
			},
			include: {
				model: Location,
				required: false,
			},
			// raw: true,
		});
		if (!modelObj) return null;
		if (!modelObj.Location) {
			console.log('thiết bị ko gắn với trạm thì ko cho điều khiển bật , tắt');
			return functionReturnCode.REF_NOT_FOUND;
		}
		if (modelObj.is_waiting_confirm !== 0) {
			console.log('thiết bị đang chờ confirm thì ko cho điều khiển bật , tắt');
			return functionReturnCode.CATCH_ERROR;
		}
		let status = 0;

		if (type === APP_SENSOR_TYPE_DEFAULT.CORE) {
			status = (modelObj.is_active + 1) % 2;
		}
		if (type === APP_SENSOR_TYPE_DEFAULT.ALARM) {
			status = (modelObj.is_alarm + 1) % 2;
		}
		if (type === APP_SENSOR_TYPE_DEFAULT.PUMP) {
			status = (modelObj.is_pump + 1) % 2;
		}
		try {
			/** call api sang mqtt server va cho phan hoi neu mqttSv gui msg thanh cong thi update truong is_waiting_confirm*/
			const result = await fetch(`${MQTT_SERVER_ENDPOINT}/toggleSensor`, {
				method: 'POST',
				headers: {
					Accept: 'application/json',
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					macId,
					locationId: modelObj?.Location.id,
					type,
					status,
					MqttUsername: process.env.MQTT_USER,
					MqttPassword: process.env.MQTT_PASS,
				}),
			});
			if (result.ok) {
				console.log(result);
				await SensorDevice.scope(null).update({ is_waiting_confirm: 1 }, { where: { macId } });
				return functionReturnCode.SUCCESS;
			}
			return functionReturnCode.THIRD_API_ERROR;
		} catch (e) {
			console.log(e);
			// handleError(e, res, SensorDevice.tableName);
			return functionReturnCode.CATCH_ERROR;
		}
	}

	async insert(model, res) {
		if (model.is_active !== 1) {
			model.is_active = 0;
		}
		const locationId = model.location_id;
		const device_type = model.device_type;
		// const checkHasLocation = await Location.findByPk(locationId);
		const checkHasDeviceType = await SensorDeviceType.findByPk(device_type);
		if (!checkHasDeviceType) {
			return functionReturnCode.REF_NOT_FOUND;
		} else {
			try {
				await SensorDevice.create(model);
				return functionReturnCode.SUCCESS;
			} catch (e) {
				handleError(e, res, SensorDevice.tableName);
				return functionReturnCode.ALREADY_CATCH_BEFORE;
			}
		}
	}

	/** @Override  update*/
	async update(updateModel, res, whereClause) {
		if (updateModel.is_active !== 1) {
			updateModel.is_active = 0;
		}
		const locationId = updateModel.location_id;
		const device_type = updateModel.device_type;
		// const checkHasLocation = await Location.findByPk(locationId);
		const checkHasDeviceType = await SensorDeviceType.findByPk(device_type);
		if (!checkHasDeviceType) {
			return functionReturnCode.REF_NOT_FOUND;
		} else {
			try {
				await SensorDevice.scope(null).update(updateModel, whereClause);
				return functionReturnCode.SUCCESS;
			} catch (e) {
				handleError(e, res, SensorDevice.tableName);
				return functionReturnCode.ALREADY_CATCH_BEFORE;
			}
		}
	}

	detail(id) {
		return SensorDevice.scope(null).findOne({
			where: { id },
			include: [
				{
					model: Location,
					required: false,
					attributes: ['id', 'location_name'],
				},
				{
					model: SensorDeviceType,
					required: false,
					attributes: ['id', 'type_name', 'description'],
				},
			],
		});
	}

	search(rest /* object like {id : 1}*/, page = 1, size = 10, excludeAttribute /* array*/) {
		return SensorDevice.scope(null).findAndCountAll({
			where: rest,
			include: [
				{
					model: Location,
					required: false,
					attributes: ['id', 'location_name'],
				},
				{
					model: SensorDeviceType,
					required: false,
					attributes: ['id', 'type_name'],
				},
			],
			attributes: { exclude: excludeAttribute },
			offset: (page - 1) * size,
			limit: size,
			order: [['created_at', 'ASC']],
		});
	}
}

module.exports = new SensorDeviceService();
