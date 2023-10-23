const jwtUtilModel = require('../models/util-model/jwt.util-model');
const { messageConst, statusCode } = require('../constant');

async function verifyToken(req, res, next) {
	try {
		const token = req.headers.authorization.replace('Bearer ', '');
		const { id, exp } = await jwtUtilModel.verify(token);
		if (new Date().getTime() / 1000 > exp) {
			res.status(statusCode.NOT_AUTHEN_CODE).json({ msg: messageConst.TOKEN_EXPIRE });
		}
		req.id = id;
		next();
	} catch (e) {
		console.log(e);
		res.status(statusCode.NOT_AUTHEN_CODE).json({ msg: messageConst.TOKEN_INVALID });
	}
}

module.exports = verifyToken;
