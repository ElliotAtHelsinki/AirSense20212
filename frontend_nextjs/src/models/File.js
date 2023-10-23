import Base from "./Base";

class FileModel extends Base {
    constructor() {
        super("");
    }

    uploadImage(file) {
        const formData = new FormData();
        formData.append("file", file);
        return this.apiPost(`/upload-image`,formData);
    }
}

export default new FileModel();
