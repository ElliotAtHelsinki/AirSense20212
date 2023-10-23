import Base from "./Base";

class Admin extends Base {
    constructor() {
        super("/admin");
    }

    search(queryObj) {
        return this.apiGet("/search", queryObj);
    }

    create(body) {
        return this.apiPost("/insert", body);
    }

    update(id, body) {
        return this.apiPut(`/update/${id}`, body);
    }

    toggleActive(id) {
        return this.apiPut(`/toggle-active/${id}`);
    }

    delete(id) {
        return this.apiDelete(`/delete/${id}`);
    }

    detail(id) {
        return this.apiGet(`/detail/${id}`);
    }
}

export default new Admin();
