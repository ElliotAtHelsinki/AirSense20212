import Cookie from "js-cookie";
import superagent from "superagent";
import { notification } from "antd";
import CONSTANT from "../utils/constant";
import { DatabaseOutlined, DeleteOutlined } from "@ant-design/icons";

export const API_ROOT = process.env.NEXT_PUBLIC_SERVER;
// export const API_ROOT = process.env.NEXT_PUBLIC_SERVER_LOCAL;

export const setToken = (access) => {
    if (access) {
        Cookie.set("token", JSON.stringify(access), {
            expires: 7,
        });
    } else {
        Cookie.remove("token");
        localStorage.removeItem("user");
    }
};
export const clearToken = () => setToken(null);

const attachToken = (req) => {
    let accessInfo;
    try {
        accessInfo = JSON.parse(
            Cookie.get("token") || document.cookie.replaceAll("token", "")
        );
    } catch {
        accessInfo = null;
    }
    if (accessInfo) {
        req.set("Authorization", `Bearer ${accessInfo}`);
    }
};
const responseBody = (res) => {
    if (res.status === CONSTANT.CREATED_CODE) {
        notification.success({ message: "Thêm mới/cập nhật thành công" });
    }
    if(res.status === CONSTANT.DELETED_CODE){
        notification.success({ message: "Xóa thành công" });

    }
    // more if block here
    return res.body ? res.body : res.text;
};
const catchError = (e) => {
    let error = e.response?.body;
    if (e.status === CONSTANT.SERVER_ERROR_CODE) {
        notification.error({
            message: "Server đang bảo trì, vui lòng thử lại sau ít phút",
            icon : <DatabaseOutlined style={{color : 'red'}}/>
        });
    } else {
        notification.error({
            message: "Đã có lỗi xảy ra",
        });
    }

    throw error;
};
const DEFAULT_TIMEOUT = 10000
export const requests = {
    del: (url, body) =>
        superagent
            .del(url, body)
            .use(attachToken)
            .timeout(DEFAULT_TIMEOUT)
            .then(responseBody)
            .catch(catchError),
    get: (url, query) =>
        superagent
            .get(url, query)
            .use(attachToken)
            .timeout(DEFAULT_TIMEOUT)
            .then(responseBody)
            .catch(catchError),
    put: (url, body) =>
        superagent
            .put(url, body)
            .use(attachToken)
            .timeout(DEFAULT_TIMEOUT)
            .then(responseBody)
            .catch(catchError),
    post: (url, body) =>
        superagent
            .post(url, body)
            .use(attachToken)
            .timeout(DEFAULT_TIMEOUT)
            .then(responseBody)
            .catch(catchError),
    postDownload: (url, body) =>
        superagent
            .post(url, body)
            .responseType("blob")
            .use(attachToken)
            .then((res) => res)
            .catch(catchError),
    download: (url, query) =>
        superagent
            .get(url, query)
            .responseType("blob")
            .use(attachToken)
            .then(responseBody)
            .catch(catchError),
};

class Base {
    constructor(apiPrefix) {
        this.apiPrefix = `${API_ROOT}${apiPrefix}`;
        this.apiRoot = `${API_ROOT}`;
    }

    apiGetWithoutPrefix = (url, query = {}) =>
        requests.get(`${this.apiRoot}${url}`, this.normalizeQuery(query));

    apiPutWithoutPrefix = (url, body) =>
        requests.put(`${this.apiRoot}${url}`, body);

    apiPostWithoutPrefix = (url, body) =>
        requests.post(`${this.apiRoot}${url}`, body);

    apiDeleteWithoutPrefix = (url, body) =>
        requests.del(`${this.apiRoot}${url}`, body);

    apiGet = (url, query = {}) =>
        requests.get(`${this.apiPrefix}${url}`, this.normalizeQuery(query));

    apiPost = (url, body) => requests.post(`${this.apiPrefix}${url}`, body);

    apiPostWithoutPrefixDownload = (url, body = {}) =>
        requests.postDownload(`${this.apiRoot}${url}`, body);

    apiDownload = (url, query = {}) =>
        requests.download(
            `${this.apiPrefix}${url}`,
            this.normalizeQuery(query)
        );

    apiPut = (url, body) => requests.put(`${this.apiPrefix}${url}`, body);

    apiDelete = (url, body) => requests.del(`${this.apiPrefix}${url}`, body);

    getOneById = (id) => this.apiGet(`/${id}`);

    getAll = (query) => this.apiGet("", query);

    getAllPagination = async (query) => {
        const res = await this.getAll(query);
        return this.formatResPagination(res);
    };

    insert = (data) => this.apiPost("", data);

    updateById = ({ id, data }) => this.apiPut(`/${id}`, data);

    deleteById = (id) => this.apiDelete(`/${id}`);

    formatResPagination = (res) => {
        if (res?.data?.content) {
            // console.log("total ", res);
            return {
                content: res.data.content,
                total: res.data.totalElements,
                ...omit(res, ["data"]),
            };
        }
        if (res?.content) {
            // console.log("total ", res);
            return {
                content: res.content,
                total: res.totalElements,
            };
        }
        if (res?.length > 0) {
            return {
                content: res,
                total: res.length,
            };
        }
        return {
            content: [],
            total: 0,
        };
    };
    normalizeQuery = (query) => {
        const formatQuery = {};
        Object.keys(query).forEach((key) => {
            if (query[key] !== null && typeof query[key] === "string") {
                formatQuery[key] = query[key].trim();
            } else if (query[key] !== null && !Number.isNaN(query[key])) {
                formatQuery[key] = query[key];
            }
        });
        return formatQuery;
    };
}

export default Base;
