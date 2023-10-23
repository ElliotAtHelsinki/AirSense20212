const verifyToken = require('../middlewares/authen.middleware');
const { checkPermission } = require('../middlewares/author.middleware');
const { sequelize, SensorDevice } = require('../models/index.model');
const { QueryTypes } = require('sequelize');
const { toggleType } = require('../constant');

const webExposeRoute = require('express').Router();

webExposeRoute.get(
	'/check-permission',
	(req, res, next) => verifyToken(req, res, next),
	(req, res, next) => checkPermission(req.headers.permission || 'X', req, res, next),
	(_req, res) => {
		res.status(200).json({ msg: 'account verified' });
	},
);

webExposeRoute.get('/location-ids', async (_req, res) => {
	const result = await sequelize.query('select id from location', {
		type: QueryTypes.SELECT,
		raw: true,
	});
	const final = [];
	result.forEach((item) => {
		final.push(item.id);
	});
	res.status(200).json(final);
});

webExposeRoute.post('/confirm-status', async (req, res) => {
	if (req.body['AppKey'] === process.env.APP_SECRET_KEY) {
		try {
			const { macId, type, status, time } = req.body;
			const sensor = await SensorDevice.findOne({ where: { macId } });
			if (sensor.is_waiting_confirm === 0) {
				res.status(400).json({ msg: 'Trạng thái thiết bị không phù hợp' });
				return;
			}
			const parseType = () => {
				if (type === toggleType.RESPONSE_PUMP) {
					return {
						is_pump: +status === 1 ? 1 : 0,
					};
				}
				if (type === toggleType.RESPONSE_STATUS) {
					return {
						is_active: +status === 1 ? 1 : 0,
					};
				}
				if (type === toggleType.RESPONSE_ALARM) {
					return {
						is_alarm: +status === 1 ? 1 : 0,
					};
				}
				if (type === toggleType.RESPONSE_SETUP_TIME) {
					return {
						step_time: req.body.time,
					};
				}
			};
			SensorDevice.update(
				{ ...parseType(), is_waiting_confirm: 0 },
				{
					where: {
						macId,
					},
				},
			);
		} catch (e) {
			console.log(e);
			res.status(500);
		}
	}
	res.status(401);
});

module.exports = webExposeRoute;
