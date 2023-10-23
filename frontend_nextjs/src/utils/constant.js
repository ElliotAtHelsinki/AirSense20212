const CONSTANT = {
    SUCCESS_CODE: 200,
    CREATED_CODE: 201,
    DELETED_CODE: 202,
    SERVER_ERROR_CODE: 500,
    BAD_REQUEST_CODE: 400,
    NOT_FOUND_CODE: 404,
    NOT_AUTHEN_CODE: 401,
    NOT_AUTHOR_CODE: 403,
};
export const FEATURE_PERMISSION = {
    MANAGE_CUSTOMER: 'MANAGE_CUSTOMER',
    CREATE_CUSTOMER: 'CREATE_CUSTOMER',
    UPDATE_CUSTOMER: 'UPDATE_CUSTOMER',
    DELETE_CUSTOMER: 'DELETE_CUSTOMER',
    DETAIL_CUSTOMER: 'DETAIL_CUSTOMER',
    SEARCH_CUSTOMER: 'SEARCH_CUSTOMER',
    ACTIVE_CUSTOMER: 'ACTIVE_CUSTOMER',

    MANAGE_MANIFEST: 'MANAGE_MANIFEST',
    CREATE_MANIFEST: 'CREATE_MANIFEST',
    UPDATE_MANIFEST: 'UPDATE_MANIFEST',
    DELETE_MANIFEST: 'DELETE_MANIFEST',
    DETAIL_MANIFEST: 'DETAIL_MANIFEST',
    SEARCH_MANIFEST: 'SEARCH_MANIFEST',
    ACTIVE_MANIFEST: 'ACTIVE_MANIFEST',

    MANAGE_ADMIN: 'MANAGE_ADMIN',
    CREATE_ADMIN: 'CREATE_ADMIN',
    UPDATE_ADMIN: 'UPDATE_ADMIN',
    DELETE_ADMIN: 'DELETE_ADMIN',
    DETAIL_ADMIN: 'DETAIL_ADMIN',
    SEARCH_ADMIN: 'SEARCH_ADMIN',
    ACTIVE_ADMIN: 'ACTIVE_ADMIN',

    MANAGE_ADMIN_LOCATION: 'MANAGE_ADMIN_LOCATION',
    DELETE_ADMIN_LOCATION: 'DELETE_ADMIN_LOCATION',
    CREATE_ADMIN_LOCATION: 'CREATE_ADMIN_LOCATION',
    UPDATE_ADMIN_LOCATION: 'UPDATE_ADMIN_LOCATION',
    DETAIL_ADMIN_LOCATION: 'DETAIL_ADMIN_LOCATION',
    SEARCH_ADMIN_LOCATION: 'SEARCH_ADMIN_LOCATION',
    ACTIVE_ADMIN_LOCATION: 'ACTIVE_ADMIN_LOCATION',

    MANAGE_LOCATION: 'MANAGE_LOCATION',
    CREATE_LOCATION: 'CREATE_LOCATION',
    UPDATE_LOCATION: 'UPDATE_LOCATION',
    DETAIL_LOCATION: 'DETAIL_LOCATION',
    DELETE_LOCATION: 'DELETE_LOCATION',
    SEARCH_LOCATION: 'SEARCH_LOCATION',
    VIEW_AQI_LOCATION: 'VIEW_AQI_LOCATION',
    RECEIVE_EMAIL_AQI_OF_LOCATION: 'RECEIVE_EMAIL_AQI_OF_LOCATION',
    VIEW_OTHER_DATA_GRAPH: 'VIEW_OTHER_DATA_GRAPH',
    CHANGE_STATUS_LOCATION: 'CHANGE_STATUS_LOCATION',

    MANAGE_SENSOR_DEVICE: 'MANAGE_SENSOR_DEVICE',
    CREATE_SENSOR_DEVICE: 'CREATE_SENSOR_DEVICE',
    UPDATE_SENSOR_DEVICE: 'UPDATE_SENSOR_DEVICE',
    DELETE_SENSOR_DEVICE: 'DELETE_SENSOR_DEVICE',
    DETAIL_SENSOR_DEVICE: 'DETAIL_SENSOR_DEVICE',
    SEARCH_SENSOR_DEVICE: 'SEARCH_SENSOR_DEVICE',
    ACTIVE_SENSOR_DEVICE: 'ACTIVE_SENSOR_DEVICE',
    CHANGE_TIME_STEP_DEVICE: 'CHANGE_TIME_STEP_DEVICE',

    MANAGE_SENSOR_TYPE: 'MANAGE_SENSOR_TYPE',
    UPDATE_SENSOR_TYPE: 'UPDATE_SENSOR_TYPE',
    DELETE_SENSOR_TYPE: 'DELETE_SENSOR_TYPE',
    CREATE_SENSOR_TYPE: 'CREATE_SENSOR_TYPE',
    SEARCH_SENSOR_TYPE: 'SEARCH_SENSOR_TYPE',
    DETAIL_SENSOR_TYPE: 'DETAIL_SENSOR_TYPE',
};
export const APP_USER_TYPE = {
    ADMIN: 1,
    TEACHER: 2,
    BLOGGER: 3,
    CUSTOMER: 4,
    ADMIN_LOCATION: 5,
};

export const APP_SENSOR_TYPE_DEFAULT = {
    CORE: 'REQUEST_SETUP_STATUS',
    ALARM: 'REQUEST_SETUP_ALARM',
    PUMP: 'REQUEST_SETUP_PUMP',
};
// export const TOGGLE_TYPE_OF_SENSOR = {
//     CORE : 1
// }

export const GIOI_TINH = [
    {
        value: 1,
        label: 'Nam',
    },
    {
        value: 2,
        label: 'Nữ',
    },
];

export const GENDER = {
    1: 'Nam',
    2: 'Nữ',
};

export const LOCATION_STATUS = {
    1: {
        label: 'Thử nghiệm',
        color: '#F77178',
    },
    2: {label: 'Hoạt động', color: '#009551'},
    3: {label: 'Ngưng hoạt động', color: '#c0ebc3'},
};
export const SENSOR_STATUS = {
    0: {
        label: 'Không hoạt động',
        color: '#F77178',
    },
    1: {label: 'Hoạt động', color: '#009551'},
};
export const HANOI_LOCATION = {
    position: {
        lat: 21.028511,
        lng: 105.804817,
        // lat: 10.7568681, lng: 106.677876
    },
    name: 'Hà Nội , Việt Nam',
};

export const aqiToColor = (aqi) => {
    if (aqi <= 50) {
        return '#00e400';
    } else if (aqi <= 100) {
        return '#ffff00';
    } else if (aqi <= 150) {
        return '#ff7e00';
    } else if (aqi <= 200) {
        return '#ff0000';
    } else if (aqi <= 300) {
        return '#99004c';
    } else {
        return '#7e0023';
    }
};
export const TYPE_EXCEL_EXPORT = {
    AQIDay: {
        label: 'Dữ liệu ngày',
        value: 1
    },
    AQIHour: {
        label: "Dữ liệu giờ",
        value: 2
    },
    AVGConcentration: {
        label: "Dữ liệu trung bình nồng độ",
        value: 3
    },
    RawData: {
        label: "Dữ liệu thô",
        value: 4
    },
    All: {
        label: "Tất cả",
        value: 5
    },
};

export function aqiToAdvise(aqi) {
    if (!aqi) {
        return {
            normal: 'Chưa có thông tin',
            sensitive: 'Chưa có thông tin',
        };
    }
    if (aqi <= 50) {
        return {
            normal: 'Tự do thực hiện các hoạt động ngoài trời',
            sensitive: 'Tự do thực hiện các hoạt động ngoài trời',
        };
    } else if (aqi <= 100) {
        return {
            normal: 'Tự do thực hiện các hoạt động ngoài trời',
            sensitive:
                'Nên theo dõi các triệu chứng như ho hoặc khó thở, nhưng vẫn có thể hoạt động bên ngoài',
        };
    } else if (aqi <= 150) {
        return {
            normal: 'Những người thấy có triệu chứng đau mắt, ho hoặc đau họng… nên cân nhắc giảm các hoạt động ngoài trời.Đối với học sinh, có thể hoạt động bên ngoài, nhưng nên giảm bớt việc tập thể dục kéo dài',
            sensitive:
                'Nên giảm các hoạt động mạnh và giảm thời gian hoạt động ngoài trời.Những người mắc bệnh hen suyễn có thể cần sử dụng thuốc thường xuyên hơn',
        };
    } else if (aqi <= 200) {
        return {
            normal: 'Mọi người nên giảm các hoạt động mạnh khi ở ngoài trời,tránh tập thể dục kéo dài và nghỉ ngơi nhiều hơn trong nhà',
            sensitive: 'Nên ở trong nhà và giảm hoạt động mạnh. Nếu cần thiết phải ra ngoài, hãy đeo khẩu trang đạt tiêu chuẩn'
        };
    } else if (aqi <= 300) {
        return {
            normal: 'Mọi người hạn chế tối đa các hoạt động ngoài trời và chuyển tất cả các hoạt động vào trong nhà. Nếu cần thiết phải ra ngoài, hãy đeo khẩu trang đạt tiêu chuẩn',
            sensitive: 'Nên ở trong nhà và giảm hoạt động mạnh'
        };
    } else {
        return {
            normal: 'Mọi người nên ở trong nhà, đóng cửa ra vào và cửa sổ. Nếu cần thiết phải ra ngoài, hãy đeo khẩu trang đạt tiêu chuẩn',
            sensitive: 'Mọi người nên ở trong nhà, đóng cửa ra vào và cửa sổ. Nếu cần thiết phải ra ngoài, hãy đeo khẩu trang đạt tiêu chuẩn'
        };
    }
}

export function base64ToBlob(b64Data, contentType = '', sliceSize = 512) {
    const byteCharacters = atob(b64Data);
    const byteArrays = [];

    for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
        const slice = byteCharacters.slice(offset, offset + sliceSize);

        const byteNumbers = new Array(slice.length);
        for (let i = 0; i < slice.length; i++) {
            byteNumbers[i] = slice.charCodeAt(i);
        }

        const byteArray = new Uint8Array(byteNumbers);
        byteArrays.push(byteArray);
    }

    const blob = new Blob(byteArrays, {type: contentType});
    return blob;
}

export const requestParams = {
    UNSET: 'UNSET',
};
Object.freeze(GIOI_TINH);
Object.freeze(GENDER);
Object.freeze(CONSTANT);
Object.freeze(FEATURE_PERMISSION);
Object.freeze(LOCATION_STATUS);
Object.freeze(HANOI_LOCATION);
Object.freeze(requestParams);
Object.freeze(APP_USER_TYPE);
Object.freeze(APP_SENSOR_TYPE_DEFAULT);
Object.freeze(TYPE_EXCEL_EXPORT);

export default CONSTANT;
