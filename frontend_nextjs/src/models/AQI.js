import Base, { requests } from './Base';

class AQI extends Base {
    constructor() {
        super('/aqi')
    }
    downloadData({fromDate , toDate , locationId , type}) {
        return this.apiPost('/download', {fromDate , toDate , locationId , type});
    }

    daily({ date, locationId }) {
        return this.apiGet('/daily', { date, locationId });
    }


}

export default new AQI();
