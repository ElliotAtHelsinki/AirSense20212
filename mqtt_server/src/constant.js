const mqttChannel = {
  ALL: "#",
  SETUP_STATUS: new RegExp("setup/response/[^/]+/status"),
  SETUP_ALARM: new RegExp("setup/response/[^/]+/alarm"),
  SETUP_PUMP: new RegExp("setup/response/[^/]+/pump"),
  SETUP_TIME: new RegExp("setup/response/[^/]+/step-time"),
  DATA: new RegExp("data/[^/]+/[^/]+"),
};
const timeOut = 5000;

const sensorChannel = (locationId, macId) => ({
  DATA: `data/${locationId}/${macId}`,
  REQUEST_SETUP_TIME: `setup/request/${macId}/step-time`,
  RESPONSE_SETUP_TIME: `setup/response/${macId}/step-time`,
  REQUEST_SETUP_STATUS: `setup/request/${macId}/status`,
  RESPONSE_SETUP_STATUS: `setup/response/${macId}/status`,
  REQUEST_SETUP_ALARM: `setup/request/${macId}/alarm`,
  RESPONSE_SETUP_ALARM: `setup/response/${macId}/alarm`,
  REQUEST_SETUP_PUMP: `setup/request/${macId}/pump`,
  RESPONSE_SETUP_PUMP: `setup/response/${macId}/pump`,

  // REQUEST_TOGGLE_LOCATION : `/setup/request/${locationId}/location`,
  // RESPONSE_TOGGLE_LOCATION : `/setup/response/${locationId}/location`,

});
function getMacIdFromChannel (topic){
  return topic.replace('setup','')
      .replace('/request','')
      .replace('/response','')
      .replace('/step-time','')
      .replace('/status','')
      .replace('/alarm','')
      .replace('/pump','')
      .substring(1)
}
const toggleType = {
  REQUEST_STATUS: 'REQUEST_SETUP_STATUS',
  RESPONSE_STATUS: 'RESPONSE_SETUP_STATUS',
  REQUEST_ALARM: 'REQUEST_SETUP_ALARM',
  RESPONSE_ALARM: 'RESPONSE_SETUP_ALARM',
  REQUEST_PUMP: 'REQUEST_SETUP_PUMP',
  RESPONSE_PUMP: 'RESPONSE_SETUP_PUMP',
  // REQUEST_TOGGLE_LOCATION: 'REQUEST_TOGGLE_LOCATION',
  // RESPONSE_TOGGLE_LOCATION: 'RESPONSE_TOGGLE_LOCATION',
  RESPONSE_SETUP_TIME: 'RESPONSE_SETUP_TIME',
};

const appConstant = {
  EVERY_10S: "*/10 * * * * *",
  EVERY_1MINUTE: "* * * * *",
  EVERY_HOUR: "0 * * * *",
  EVERY_6HOUR: "0 */6 * * *",
  EVERY_DAY: "0 0 * * *",
  ERROR_PARSE_JSON: "parse JSON error ",
  ERROR_RECORD_FORMAT: "record format don't match",
  ERROR_INSERT_MONGO: "insert record to mongo error",
};

const appPermission = {
  VIEW_AQI: "VIEW_AQI_LOCATION",
  RECEIVE_EMAIL_AQI_OF_LOCATION: "RECEIVE_EMAIL_AQI_OF_LOCATION",
};

const appMessage = {
  NOT_AUTH: "Không có quyền truy cập tài nguyên",
  SERVER_ERROR: "Máy chủ xảy ra lỗi, vui lòng thử lại sau",
};
const returnCode = {
  TIME_OUT  : 1,
  SUCCESS : 2 ,
  FAIL : 3,
}
const AppKey = '7085e6b4fb5bf71436221f6ccd1af40c'


Object.freeze(mqttChannel);
Object.freeze(appConstant);
Object.freeze(appPermission);
Object.freeze(appMessage);
Object.freeze(toggleType);
Object.freeze(sensorChannel);
Object.freeze(timeOut);
Object.freeze(returnCode);
Object.freeze(AppKey);

module.exports = {
  mqttChannel,
  appConstant,
  appPermission,
  appMessage,
  toggleType,
  sensorChannel,
  timeOut,
  returnCode,
  AppKey,
  getMacIdFromChannel
};
