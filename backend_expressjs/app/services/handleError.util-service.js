const { errorCode, statusCode } = require('../constant');
const logger = require('../config/loggerWinston');

module.exports = {
	handleError: (error, res, tableName) => {
		logger.log('error', error);
		if (error.name === errorCode.SQLIZE_VALIDATION_ERROR) {
			return res.status(statusCode.BAD_REQUEST_CODE).json({
				error: error.errors.map((el) => ({ [el.path]: el.message })),
			});
		}
		if (error.name === errorCode.PARAMS_NUMBER_REQUIRED) {
			return res.status(statusCode.BAD_REQUEST_CODE).json({
				error: error.message,
			});
		}
		if (error.name === errorCode.SQLIZE_UNIQUE_CONSTRAINT_ERROR) {
			return res.status(statusCode.BAD_REQUEST_CODE).json({
				error: error.errors.map((el) => {
					const keyName = el?.path?.replace(`${tableName}_`, '').replace('_uindex', '');
					return {
						[keyName]: `${el.value} đã được sử dụng trong hệ thống`,
					};
				}),
			});
		}
		// more if block code
		if (error.name === errorCode.SQLIZE_DB_NAME_ERROR) {
			if (error.code === 'ER_BAD_FIELD_ERROR') {
				console.log('fields not match');
			}
			return res.status(statusCode.SERVER_ERROR_CODE).json({
				error: errorCode.SERVER_ERROR,
			});
		}

		return res.status(statusCode.SERVER_ERROR_CODE).json({
			error: errorCode.SERVER_ERROR,
		});
	},
};
