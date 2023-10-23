import Base from "./Base";

class WrapBase extends Base {
    constructor(api) {
        super(api);
    }

    search(param = {}) {
        return this.apiGet("/search", param);
    }
    create(body) {
        return this.apiPost("/insert", body);
    }
    update(body) {
        return this.apiPut("/update/" + body.id, body);
    }
    delete(id) {
        return this.apiDelete("/delete/" + id);
    }
}
export default WrapBase;
