import Base from './Base'

class SensorDeviceType extends Base {
    constructor() {
        super('/device-type')
    }

    detail(id) {
        return this.apiGet(`/detail/${id}`)
    }

    search(queryObj) {
        return this.apiGet('/search', queryObj)
    }

    create(body) {
        return this.apiPost('/insert', body)
    }

    update(id, body) {
        return this.apiPut(`/update/${id}`, body)
    }


    delete(id) {
        return this.apiDelete(`/delete/${id}`)
    }

}

export default new SensorDeviceType()