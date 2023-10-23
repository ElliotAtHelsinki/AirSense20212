const aqiService = require('../services/aqi.service');
const {messageConst} = require('../constant');
const {daily, findExcelData} = aqiService;


class AQIController {
  async getAQIDaily(req, res) {
    try {
      const {date, locationId} = req.query;
      const result = await daily(date, parseInt(locationId));
      res.send(result);
    } catch (err) {
      console.error(err);
      if (err.name == 'CastError') {
        res.status(400).send({
          msg: messageConst.BAD_PARAMETER,
        });
      } else {
        res.status(500).send({
          msg: messageConst.SERVER_ERROR,
        });
      }
    }
  }

  async exportExcelData(req, res) {
    try {
      const {fromDate, toDate, locationId, type} = req.body;
      if (!fromDate || !toDate || !locationId || !type || !Array.isArray(type)) {
        res.status(400).send({msg: messageConst.BAD_PARAMETER});
      } else {
        const result = await findExcelData(fromDate, toDate, locationId, type);
        if (result) {
          res.status(200).send(Buffer.from(result).toString('base64'));
        } else {
          res.status(500).send({
            msg: messageConst.SERVER_ERROR,
          });
        }

      }
    } catch (e) {
      console.log(e);
      res.status(500).send({
        msg: messageConst.SERVER_ERROR,
      });
    }
  }
}

module.exports = new AQIController();
