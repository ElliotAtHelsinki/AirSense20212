const mongoose = require('mongoose');

const base = {
	AQIPM25: { type: Number },
	AQIPM10: { type: Number },
	AQICO: { type: Number },
	AQISO2: { type: Number },
	AQIO3: { type: Number },
	AQINO2: { type: Number },
	AQIGeneral: { type: Number },
	AQICategory: { type: String },
	locationId: { type: Number, required: true },
};

const aqiViewHourlySchema = new mongoose.Schema(
	{
		...base,
	},
	{ timestamps: true },
);

const aqiViewDailySchema = new mongoose.Schema({ ...base }, { timestamps: true });

const avgConcentrationSchema = new mongoose.Schema(
	{
		locationId: { type: Number },
		O3: { type: Number, min: 0 }, // ug/m3
		O3in8Hr: { type: Number, min: 0 },
		PM2p5: { type: Number, min: 0 },
		PM10: { type: Number, min: 0 },
		CO: { type: Number, min: 0 },
		NO2: { type: Number, min: 0 },
		SO2: { type: Number, min: 0 },
		humidity: { type: Number, min: 0 },
		temperature: { type: Number, min: 0 },
		pressure: { type: Number, min: 0 },
		windSpeed: { type: Number, min: 0 },
		type: { type: Number, default: 0 }, // 0: hourly , 1 : daily
	},
	{ timestamps: true },
);

const dataSchema = new mongoose.Schema({
	locationId: { type: Number },
	O3: { type: Number, min: 0 }, // ug/m3
	O3in8Hr: { type: Number, min: 0 },
	PM2p5: { type: Number, min: 0 },
	PM10: { type: Number, min: 0 },
	CO: { type: Number, min: 0 },
	NO2: { type: Number, min: 0 },
	SO2: { type: Number, min: 0 },
	humidity: { type: Number, min: 0 },
	temperature: { type: Number, min: 0 },
	pressure: { type: Number, min: 0 },
	windSpeed: { type: Number, min: 0 },
	createdAt: { type: Number },
});

module.exports = {
	AQIViewHourlyModel: mongoose.model('aqi-hourly', aqiViewHourlySchema, 'aqi-view-hourly'),
	AQIViewDailyModel: mongoose.model('aqi-daily', aqiViewDailySchema, 'aqi-view-daily'),
	AVGConcentration: mongoose.model('avgConcentration', avgConcentrationSchema, 'avgConcentration'),
	DataModel: mongoose.model('data', dataSchema, 'data'),
};
