import Base from './Base';

class UserType extends Base {
    constructor() {
        super('/app-userType');
    }
    searchAll() {
        return this.apiGet('/search');
    }
}

export default new UserType();
