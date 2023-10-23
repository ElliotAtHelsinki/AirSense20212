const express = require("express");
const router = express.Router();
const {
  toggleActive,
  changeStepTime,
} = require("../controllers/sensor.controller");
const { verifyCredential } = require("../middleware/AuthenRequest");


router.post(
  "/changeStepTime",
  (req, res, next) => verifyCredential(req, res, next),
  (req, res) => changeStepTime(req, res)
);
router.post(
  "/toggleSensor",
  (req, res, next) => verifyCredential(req, res, next),
  (req, res) => toggleActive(req, res, req.body.type)
);

module.exports = router;
