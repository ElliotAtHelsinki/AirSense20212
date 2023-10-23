import moment from "moment";
import { trim, isEqual } from "../utils/opLodash";
import { FEATURE_PERMISSION } from "../utils/constant";
class AIRSENSE {
  formatTime = (
    timestamp,
    formatServer = "DD/MM/YYYY HH:mm:ss",
    format = "DD/MM/YYYY HH:mm:ss"
  ) => (timestamp ? moment(timestamp, formatServer).format(format) : "");

  formatDate = (
    timestamp,
    formatServer = "DD/MM/YYYY",
    format = "DD/MM/YYYY"
  ) => (timestamp ? moment(timestamp, formatServer).format(format) : "");

  formatTimestamp = (timestamp, format = "DD/MM/YYYY") =>
    timestamp ? moment(timestamp).format(format) : "";

  formatNumberMoney = (value) =>
    value === null || value === undefined
      ? 0
      : parseFloat(value)
          .toFixed(0)
          .replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1.");

  formatNumberCurrency = (value, type) => {
    if (trim(value)) {
      const str = trim(value.toString());
      if (parseInt(str, 10) < 0) return typeof type === "string" ? "0" : 0;
      const index = str.indexOf(".");
      if (index > 0) {
        let wholePart = parseInt(str.substring(0, index), 10);
        const decimalPart =
          index + 4 <= str.length
            ? parseInt(str.substring(index + 1, index + 3), 10)
            : parseInt(str.substring(index + 1), 10);

        if (decimalPart.toString().length === 1 && decimalPart >= 5)
          wholePart += 1;
        else if (decimalPart >= 50) wholePart += 1;

        return type === "int" ? wholePart : wholePart.toLocaleString("it-IT");
      }
      const c = parseInt(str, 10).toLocaleString("it-IT");
      return type === "int" ? parseInt(str, 10) : c;
    }
    return typeof type === "string" ? null : 0;
  };

  formatNumber = (value, type) => {
    let valueFormat = null;
    if (type === "float") {
      valueFormat = parseFloat(trim(value.toString()).replaceAll(",", "."));
    } else {
      valueFormat = parseInt(trim(value.toString()).replaceAll(/\D/g, ""), 10);
    }
    return valueFormat || 0;
  };

  canAccessFuture = (featureCode, permissions) => {
    const arrPermissionName = permissions?.map(item=>item.name) || []
    return arrPermissionName?.includes(featureCode) || false
  };
}

export default new AIRSENSE();
