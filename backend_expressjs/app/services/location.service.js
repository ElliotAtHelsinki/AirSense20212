const { Location, SensorDevice, SensorDeviceType, sequelize } = require('../models/index.model');
const BaseService = require('./base.service');
const { handleError } = require('./handleError.util-service');
const { functionReturnCode } = require('../constant');
const { Op, where } = require('sequelize');

class LocationService extends BaseService {
	constructor() {
		super(Location);
	}

	changeStatusActive(id, status) {
		return Location.update(
			{ status },
			{
				where: {
					id,
				},
			},
		);
	}

	async detail(id) {
		return Location.findByPk(id, {
			include: {
				model: SensorDevice.scope(null),
				required: false,
				include: {
					model: SensorDeviceType,
					require: false,
					attributes: ['type_name', 'description', 'id'],
				},
			},
		});
	}

	async insert(req, res) {
		const t = await sequelize.transaction();
		const model = req.body;
		model.created_id = req.id;
		try {
			const locationCreated = await Location.create(model, { transaction: t, raw: true });
			/** chỉ cho phép chọn những thiết bị chưa được gắn vào trạm quan trắc nào */
			if (model.sensorIds) {
				const rowEffect = await SensorDevice.update(
					{ location_id: locationCreated.id, updated_id: req.id },
					{
						where: {
							id: {
								[Op.in]: model.sensorIds,
							},
							location_id: null,
						},
						transaction: t,
					},
				);
				if (rowEffect[0] === 0) {
					return functionReturnCode.REFERENCE_OBJ_NOT_AVAILABLE;
				}
			}
			await t.commit();
			return functionReturnCode.SUCCESS;
		} catch (e) {
			t.rollback();
			handleError(e, res);
			return functionReturnCode.ALREADY_CATCH_BEFORE;
		}
	}

	async update(req, res) {
		const t = await sequelize.transaction();
		const model = req.body;
		model.updated_id = req.id;
		const idUpdate = req.params.id;
		try {
			const oldLocation = await Location.findByPk(idUpdate);
			if (oldLocation) {
				await Location.update(model, { where: { id: idUpdate }, transaction: t });
				const locationUpdated = await Location.findByPk(idUpdate);
				await SensorDevice.scope(null).update(
					{ location_id: null, updated_id: req.id },
					{
						where: {
							location_id: oldLocation.id,
						},
						transaction: t,
					},
				);
				if (model.sensorIds) {
					const rowEffect = await SensorDevice.update(
						{ location_id: locationUpdated.id, updated_id: req.id },
						{
							where: {
								id: {
									[Op.in]: model.sensorIds,
								},
								location_id: null,
							},
							transaction: t,
						},
					);
					if (rowEffect[0] === 0) {
						return functionReturnCode.REFERENCE_OBJ_NOT_AVAILABLE;
					}
				}
				// await locationUpdated.setSensorDevices(model.sensorIds);
				await t.commit();
				return functionReturnCode.SUCCESS;
			} else {
				return functionReturnCode.NOT_FOUND;
			}
		} catch (e) {
			t.rollback();
			handleError(e, res);
			return functionReturnCode.ALREADY_CATCH_BEFORE;
		}
	}
}

module.exports = new LocationService();
