import Base from './Base'

class SensorDevice extends Base {
  constructor() {
    super('/sensor')
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

  toggleActive(id , type) {
    return this.apiPut(`/toggle-active/${id}/${type}`)
  }

  delete(id) {
    return this.apiDelete(`/delete/${id}`)
  }

  detail(id) {
    return this.apiGet(`/detail/${id}`)
  }
}

export default new SensorDevice()