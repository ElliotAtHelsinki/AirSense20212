function verifyCredential(req, res, next) {
  if (
    req.body.MqttUsername === process.env.MQTT_USER &&
    req.body.MqttPassword === process.env.MQTT_PASS
  ) {
    next();
  } else res.status(401).json({ msg: "bad credential" });
}

module.exports = { verifyCredential };
