
import Base from './Base'

class Overview extends Base {
  constructor() {
    super('/overview')
  }

  user() {
    return this.apiGet('/user')
  }

  location() {
    return this.apiGet('/location')
  }

  sensor() {
    return this.apiGet('/sensor')
  }
  aqi({date}) {
    return this.apiGet('/aqi', {date : date})
  }
}

export default new Overview()
