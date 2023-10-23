const { AQI, Location } = require('../models/index.model');
const moment = require('moment');
const { AQIViewDailyModel, AQIViewHourlyModel, AVGConcentration, DataModel } = AQI;
const writeXlsxFile = require('write-excel-file/node');
const { HEADER_DATA_AQI, HEADER_DATA_CONCENTRATION, HEADER_DATA_RAW } = require('../constant');

const typeExcel = {
	AQIDay: 1,
	AQIHour: 2,
	AVGConcentration: 3,
	RawData: 4,
};
const typeExcelRevert = {
	1: 'AQIDay',
	2: 'AQIHour',
	3: 'AVGConcentration',
	4: 'RawData',
	5: 'All',
};

class AQIService {
	async daily(date, locationId) {
		const startDateUTC = moment(date, 'YYYY-MM-DD').startOf('day').utc().toDate();
		const endDateUTC = moment(date, 'YYYY-MM-DD').endOf('day').utc().toDate();
		console.log(moment(date, 'YYYY-MM-DD').startOf('day').utc(), startDateUTC, endDateUTC);
		/** if send locationId will find hourly AQI */
		if (locationId) {
			const checkHasLocationId = await Location.findByPk(locationId);
			if (checkHasLocationId) {
				const dataHourly = await AQIViewHourlyModel.find({
					locationId: {
						$eq: locationId,
					},
					createdAt: {
						$gt: startDateUTC,
						$lt: endDateUTC,
						$ne: null,
					},
				});
				const dataDaily = await AQIViewDailyModel.findOne({
					locationId: {
						$eq: locationId,
					},
					createdAt: {
						$gt: startDateUTC,
						$lt: endDateUTC,
						$ne: null,
					},
				}).sort({ createdAt: -1 });

				const dataAvg = await AVGConcentration.find({
					locationId: {
						$eq: locationId,
					},
					type: {
						$eq: 0,
					},
					createdAt: {
						$gt: startDateUTC,
						$lt: endDateUTC,
						$ne: null,
					},
				});

				return {
					day: dataDaily,
					eachHour: dataHourly,
					concentration: dataAvg,
				};
			}
		} else {
			const dataDaily = await AQIViewDailyModel.find({
				createdAt: {
					$gt: startDateUTC,
					$lt: endDateUTC,
					$ne: null,
				},
			});
			const listLocation = await Location.findAll({ raw: true });
			listLocation.forEach((location) => {
				const dataLocation = dataDaily.find((data) => data.locationId === location.id);
				location.data = dataLocation;
			});
			return listLocation;
		}
	}

	async findExcelData(fromDate, toDate, locationId, type) {
		let model;
		let createdAt = {
			$gt: moment(fromDate, 'YYYY-MM-DD').startOf('day').utc().toDate(),
			$lt: moment(toDate, 'YYYY-MM-DD').endOf('day').utc().toDate(),
			$ne: null,
		};
		let ExcelHeader = HEADER_DATA_AQI;
		const dataExcel = [];
		for (const i of type) {
			if (+i === typeExcel.AQIDay) model = AQIViewDailyModel;
			else if (+i === typeExcel.AQIHour) model = AQIViewHourlyModel;
			else if (+i === typeExcel.RawData) {
				model = DataModel;
				createdAt = {
					$gt: moment(fromDate, 'YYYY-MM-DD').startOf('day').valueOf(),
					$lt: moment(toDate, 'YYYY-MM-DD').endOf('day').valueOf(),
					$ne: null,
				};
				ExcelHeader = HEADER_DATA_RAW;
			} else if (+i === typeExcel.AVGConcentration) {
				model = AVGConcentration;
				ExcelHeader = HEADER_DATA_CONCENTRATION;
			} else continue;

			const data = await model
				.find({
					createdAt,
					locationId: {
						$eq: locationId,
					},
				})
				.lean()
				.exec()
				.then((res) => {
					return res.map((obj) =>
						ExcelHeader.map((item) => item.value).map((key) => ({ value: obj[key] || '<null>' })),
					);
				})
				.catch((e) => {
					console.log('query fail', e);
				});
			dataExcel.push([ExcelHeader, ...data]);
		}

		const buffer = await writeXlsxFile(dataExcel, {
			sheets: type.map((item) => typeExcelRevert[item]),
			buffer: true,
			dateFormat: 'dd/mm/yyyy hh:mm:ss',
		});
		return buffer;
	}
}

module.exports = new AQIService();
