import Base from './Base';

class Permission extends Base {
    constructor() {
        super('/permission');
    }

    searchAll() {
        return this.apiGet('/search');
    }
}

export default new Permission();
