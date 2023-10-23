import React, { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import UrlBreadcrumb from '../../../../src/components/common/UrlBreadcrumb';
import PageAdminLayout from '../../../../src/components/PageAdminLayout';
import { useQuery } from 'react-query';
import {
    Avatar,
    Button,
    Checkbox,
    DatePicker,
    Descriptions,
    Dropdown,
    Form,
    Menu,
    Modal,
    Radio,
    Select,
    Spin,
    Switch,
    Table,
    Tabs,
    Tag,
    Tooltip as AntdTooltip,
} from 'antd';
import { AndroidOutlined } from '@ant-design/icons';
import Location from '../../../../src/models/Location';
import {
    aqiToAdvise,
    aqiToColor, base64ToBlob, bufferToBlob, bufferToFile,
    FEATURE_PERMISSION,
    LOCATION_STATUS,
    TYPE_EXCEL_EXPORT,
} from "../../../../src/utils/constant";
import moment from 'moment';
import MapCreateLocation from '../../../../src/components/MapCreateLocation';
import SearchCommon from '../../../../src/components/common/SearchCommon';
import { saveAs } from 'file-saver';

import {
    BarElement,
    CategoryScale,
    Chart as ChartJS,
    Legend,
    LinearScale,
    Title,
    Tooltip,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import AQI from '../../../../src/models/AQI';
import { useForm } from 'antd/lib/form/Form';
import AIRSENSE from '../../../../src/models/AIRSENSE';
import useUser from '../../../../src/hooks/useUser';
import log from 'tailwindcss/lib/util/log';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

const detailAdminBread = [
    {
        name: 'Quản lý trạm quan trắc',
    },
    {
        name: 'Danh sách trạm',
        url: '/admin/location',
    },
    {
        name: 'Chi tiết trạm',
    },
];

function TabInfo({ data, ...props }) {
    return (
        <>
            <div className='w-full text-center pt-4 pb-8'>
                <Avatar
                    size={{
                        md: 60,
                        lg: 80,
                        xl: 120,
                        xxl: 150,
                    }}
                    icon={<AndroidOutlined />}
                    src={data?.avatar}
                />
            </div>

            <Descriptions
                column={1}
                bordered
                layout='horizontal'
                labelStyle={{
                    fontWeight: 700,
                    textAlign: 'center',
                }}
            >
                <Descriptions.Item label='Tên trạm'>
                    {data?.location_name}
                </Descriptions.Item>
                <Descriptions.Item label='Địa chỉ lặp đặt trạm'>
                    {data?.address}
                </Descriptions.Item>
                <Descriptions.Item label='Trạng thái hoạt động'>
                    <Tag color={LOCATION_STATUS[data?.status]?.color}>
                        {LOCATION_STATUS[data?.status].label}
                    </Tag>
                </Descriptions.Item>
                <Descriptions.Item label='Ngày bắt đầu thử nghiệm'>
                    {data?.testing_date}
                </Descriptions.Item>

                <Descriptions.Item label='Mô tả'>
                    {data?.description}
                </Descriptions.Item>
                <Descriptions.Item label='Liên lạc'>
                    {data?.contact}
                </Descriptions.Item>
                <Descriptions.Item label='Khởi Tạo lúc'>
                    {moment(data?.created_at).format('LLL')}
                </Descriptions.Item>
                <Descriptions.Item label='Cập nhật gần nhất vào lúc'>
                    {moment(data?.updated_at).format('LLL')}
                </Descriptions.Item>
            </Descriptions>
        </>
    );
}

function TabSensor({ data, ...props }) {
    const columns = [
        {
            title: '#',
            render: (value, item, index) => index + 1,
        },
        {
            title: 'Ảnh thiết bị',
            dataIndex: 'avatar',
            key: 'avatar',
            render: (value) => <Avatar src={value} />,
        },
        {
            title: 'Địa chỉ MAC',
            dataIndex: 'macId',
            key: 'macId',
        },

        {
            title: 'Loại thiết bị',
            dataIndex: 'SensorDeviceType',
            key: 'deviceType',
            render: (value) => value.type_name,
        },
        {
            title: 'Thời gian gửi bản tin',
            dataIndex: 'step_time',
            key: 'step_time',
        },
        {
            title: 'Trạng thái hoạt động',
            dataIndex: 'is_active',
            key: 'is_active',
            render: (value, record) => (
                <Switch disabled={true} checked={value === 1} />
            ),
        },
    ];
    const [localData, setLocalData] = useState(data);
    const [searchMacId, setSearchMacId] = useState('');
    const [searchStatus, setSearchStatus] = useState(null);
    useEffect(() => {
        setLocalData(data);
    }, [data]);
    return (
        <>
            <div className='flex justify-between gap-8'>
                <div className='flex gap-4 flex-grow'>
                    <SearchCommon
                        size='middle'
                        placeholder='Nhập địa chỉ MAC'
                        className='flex-1'
                        defaultValue={searchMacId}
                        onSearch={(value) => {
                            setSearchMacId(value);
                            if (!value) setLocalData(data);
                            else {
                                setLocalData(
                                    data.filter((item) =>
                                        item.macId.includes(value)
                                    )
                                );
                            }
                        }}
                    />

                    <Select
                        placeholder='Trạng thái hoạt động'
                        className='flex-1'
                        defaultValue={searchStatus}
                        onSelect={(value) => {
                            setSearchStatus(value);
                            if (!value) setLocalData(data);
                            else {
                                setLocalData(
                                    data.filter(
                                        (item) => item.is_active === value
                                    )
                                );
                            }
                        }}
                    >
                        <Select.Option value={null}>Tất cả</Select.Option>
                        <Select.Option value={0}>Không hoạt động</Select.Option>
                        <Select.Option value={1}>Hoạt động</Select.Option>
                    </Select>
                </div>
            </div>

            <Table
                className='mt-8'
                columns={columns}
                dataSource={localData}
                scroll={{
                    x: 1050,
                }}
                pagination={false}
            />
        </>
    );
}

function TabStatistic({ locationId, setShowPopupExport, ...props }) {
    const [filterDate, setFilterDate] = useState(
        new Date().toISOString().split('T')[0]
    );
    const [chartDataType, setChartDataType] = useState('AQIGeneral');
    const [chartDataConcentrationType, setChartDataConcentrationType] =
        useState('temperature');
    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: false,
            },
            title: {
                display: false,
            },
        },
    };
    const { data, isLoading } = useQuery(
        ['getDataAQILocation', locationId, filterDate],
        () =>
            AQI.daily({
                date: filterDate,
                locationId: locationId,
            }),
        {
            enabled: !!locationId && !!filterDate,
            onSuccess: (res) => {
                res.eachHour.forEach((item) => {
                    item.hour = new Date(item.createdAt).getHours() + 'Giờ';
                });
                return res;
            },
        }
    );
    // console.log(filterDate , moment(filterDate,'DD-MM-YYYY'));
    const labels = useCallback(() => {
        if (!data) return [];
        return data.eachHour.map((item) => item?.hour);
    }, [data]);

    function getDateSet(propertyName, isAvg) {
        if (!data) return [];
        return {
            labels: labels(),
            datasets: [
                {
                    // label : 'AQI',
                    data: !isAvg
                        ? data.eachHour.map((item) => item[propertyName])
                        : data.concentration.map((item) => item[propertyName]),
                    /** need have function genBG(itemName , value) */
                    backgroundColor: 'rgba(255, 99, 132, 0.5)',
                },
            ],
        };
    }

    return (
        <div>
            <div className='flex justify-between w-full mb-8'>
                <div className='text-primary text-2xl font-bold'>
                    Thống kê chỉ số AQI của ngày hôm nay
                </div>
                <div className='flex gap-4'>
                    <DatePicker
                        onChange={(date, _dateString) => {
                            setFilterDate(_dateString);
                        }}
                        defaultValue={moment(filterDate, 'YYYY-MM-DD')}
                        format={'YYYY-MM-DD'}
                        className='flex-1'
                        disabledDate={(current) =>
                            current && current.valueOf() > Date.now()
                        }
                    />
                    <Button type='primary' onClick={() => setShowPopupExport()}>
                        Export dữ liệu
                    </Button>
                </div>
            </div>

            <div className='w-full flex '>
                <Spin spinning={isLoading}>
                    <div className='w-full flex  gap-6'>
                        <div
                            className='p-16 rounded shadow font-bold text-4xl flex items-center text-center'
                            style={{
                                backgroundColor: aqiToColor(
                                    data?.day?.AQIGeneral
                                ),
                            }}
                        >
                            {data?.day?.AQIGeneral
                                ? data?.day?.AQIGeneral
                                : 'null'}
                        </div>
                        <div className='py-3 flex flex-col gap-4'>
                            {data?.day?.AQICategory && (
                                <div className='flex gap-4 items-center justify-between'>
                                    <span className='text-xl font-bold '>
                                        {data?.day?.AQICategory}
                                    </span>

                                    <span className='text-base font-semibold '>
                                        Chất gây ôi nhiễm chính{' '}
                                        {Object.keys(data?.day || {})
                                            .find(
                                                (item) =>
                                                    item !== 'AQIGeneral' &&
                                                    data?.day[item] ===
                                                        data?.day?.AQIGeneral
                                            )
                                            ?.replace('AQI', '')}
                                    </span>
                                </div>
                            )}

                            <span className='text-base text-primary font-bold '>
                                KHUYẾN NGHỊ VỀ SỨC KHỎE
                            </span>
                            <div className='text-sm font-medium flex flex-col gap-4'>
                                <span>
                                    <b>Người có sức khỏe bình thường</b> :{' '}
                                    {aqiToAdvise(data?.day?.AQIGeneral).normal}
                                </span>
                                <span>
                                    <b>Người có sức khỏe yếu</b> :{' '}
                                    {
                                        aqiToAdvise(data?.day?.AQIGeneral)
                                            .sensitive
                                    }
                                </span>
                            </div>
                        </div>
                    </div>
                </Spin>
            </div>
            <div className=' my-8 '>
                <div className='flex justify-between w-full mb-6'>
                    <span className='text-primary text-2xl font-bold'>
                        Thống kê chỉ số AQI theo giờ
                    </span>
                    <Select
                        style={{ width: 200 }}
                        defaultValue={chartDataType}
                        onSelect={(value) => setChartDataType(value)}
                    >
                        <Select.Option value='AQIGeneral'>
                            Aqi trung bình
                        </Select.Option>
                        <Select.Option value='AQICO'>AQI CO</Select.Option>
                        <Select.Option value='AQIO3'>AQI O3</Select.Option>
                        <Select.Option value='AQINO'>AQI NO</Select.Option>
                        <Select.Option value='AQISO2'>AQI SO2</Select.Option>
                        <Select.Option value='AQIPM2p5'>
                            AQI PM2.5
                        </Select.Option>
                        <Select.Option value='APIPM10'>AQI PM10</Select.Option>
                    </Select>
                </div>
            </div>
            {data && (
                <div className='flex flex-col gap-4'>
                    {/** ===PM2.5=== */}
                    <Bar
                        options={chartOptions}
                        data={getDateSet(chartDataType)}
                    />
                </div>
            )}

            <div className=' my-8 '>
                <div className='flex justify-between w-full mb-6'>
                    <span className='text-primary text-2xl font-bold'>
                        Thống kê chỉ số môi trường theo giờ
                    </span>
                    <Select
                        style={{ width: 200 }}
                        defaultValue={chartDataConcentrationType}
                        onSelect={(value) =>
                            setChartDataConcentrationType(value)
                        }
                    >
                        <Select.Option value={'temperature'}>
                            Nhiệt độ
                        </Select.Option>
                        <Select.Option value={'humidity'}>Độ ẩm</Select.Option>
                        <Select.Option value={'windSpeed'}>Gió</Select.Option>
                        <Select.Option value={'pressure'}>
                            Áp suất
                        </Select.Option>
                        <Select.Option value={'CO'}>Nồng độ CO</Select.Option>
                        <Select.Option value={'NO2'}>Nồng độ NO2</Select.Option>
                        <Select.Option value={'O3'}>Nồng độ O3</Select.Option>
                        <Select.Option value={'PM2p5'}>
                            Nồng độ PM2.5
                        </Select.Option>
                        <Select.Option value={'PM10'}>
                            Nồng độ PM10
                        </Select.Option>
                        <Select.Option value={'PMSO2'}>
                            Nồng độ SO2
                        </Select.Option>
                    </Select>
                </div>
            </div>
            {data && (
                <div className='flex flex-col gap-4'>
                    {/** ===PM2.5=== */}
                    <Bar
                        options={chartOptions}
                        data={getDateSet(chartDataConcentrationType, true)}
                    />
                </div>
            )}
        </div>
    );
}

function LocationDetail({ ...props }) {
    const router = useRouter();
    const { id, tab } = router.query;
    const { data, isLoading } = useQuery(
        'getDetailLocation',
        () => Location.detail(id),
        {
            enabled: !!id,
        }
    );
    const [showPopupExport, setShowPopupExport] = useState(false);
    const [form] = useForm();
    const { permissions } = useUser();

    const CAN_VIEW_AQI_DATA = AIRSENSE.canAccessFuture(
        FEATURE_PERMISSION.VIEW_AQI_LOCATION,
        permissions
    );

    function handleChangeTab(tabId) {
        router.query.tab = tabId;
        router.push(router);
    }
    const [loadingExport , setLoadingExport] = useState(false)

    return (
        <section>
            <UrlBreadcrumb breadcrumbs={detailAdminBread} />
            <PageAdminLayout pageName='Chi tiết trạm quan trắc'>
                <Spin spinning={isLoading}>
                    <Tabs
                        className='custom-tab'
                        defaultActiveKey={tab}
                        onChange={handleChangeTab}
                        // centered
                        tabBarGutter={50}
                    >
                        <Tabs.TabPane tab='Thông tin' key='1'>
                            {data && <TabInfo data={data} />}
                        </Tabs.TabPane>
                        <Tabs.TabPane tab='Vị trí' key='2'>
                            {data && data?.latitude && data?.longitude && (
                                <MapCreateLocation
                                    height={700}
                                    marker={{
                                        position: {
                                            lat: data?.latitude,
                                            lng: data?.longitude,
                                        },
                                    }}
                                />
                            )}
                        </Tabs.TabPane>
                        <Tabs.TabPane tab='Thiết bị' key='3'>
                            {data && <TabSensor data={data.SensorDevices} />}
                        </Tabs.TabPane>
                        {CAN_VIEW_AQI_DATA && (
                            <Tabs.TabPane tab='Thống kê' key='4'>
                                <TabStatistic
                                    locationId={id}
                                    setShowPopupExport={() => {
                                        form.resetFields();
                                        setShowPopupExport(true);
                                    }}
                                />
                            </Tabs.TabPane>
                        )}
                    </Tabs>
                </Spin>
            </PageAdminLayout>
            <Modal
                title='Export dữ liệu'
                visible={showPopupExport}
                footer={null}
                onCancel={()=>setShowPopupExport(false)}
            >
                <Form
                    layout='vertical'
                    form={form}
                    onFinish={(value) => {
                        setLoadingExport(true)
                        const body = {
                            fromDate: moment(value.fromDate, 'YYYY-MM-DD'),
                            toDate: moment(value.toDate, 'YYYY-MM-DD'),
                            locationId: id,
                            type: value.typeExport,
                        };
                        AQI.downloadData(body)
                            .then((res) => {
                                saveAs(base64ToBlob(res),'dataExport.xlsx')
                            })
                            .catch((e) => {
                                console.log(e);
                            })
                            .finally(()=>setLoadingExport(false))
                        ;
                    }}
                >
                    <Form.Item
                        rules={[
                            {
                                required: true,
                                message: 'Chọn loại dữ liệu cần export!',
                            },
                        ]}
                        name='typeExport'
                        label='Chọn loại dữ liệu cần export'
                    >
                        <Checkbox.Group className='flex flex-col gap-4'>
                            <Checkbox value={TYPE_EXCEL_EXPORT.AQIDay.value}>
                                {TYPE_EXCEL_EXPORT.AQIDay.label}
                            </Checkbox>
                            <Checkbox value={TYPE_EXCEL_EXPORT.AQIHour.value}>
                                {TYPE_EXCEL_EXPORT.AQIHour.label}
                            </Checkbox>
                            <Checkbox
                                value={TYPE_EXCEL_EXPORT.AVGConcentration.value}
                            >
                                {TYPE_EXCEL_EXPORT.AVGConcentration.label}
                            </Checkbox>
                            <Checkbox value={TYPE_EXCEL_EXPORT.RawData.value}>
                                {TYPE_EXCEL_EXPORT.RawData.label}
                            </Checkbox>
                        </Checkbox.Group>
                    </Form.Item>
                    <div className='flex gap-4'>
                        <Form.Item
                            className='w-full flex-1'
                            rules={[
                                {
                                    required: true,
                                    message:
                                        'Ngày bắt đầu không được để trống!',
                                },
                            ]}
                            name='fromDate'
                            label='Bắt đầu từ ngày'
                        >
                            <DatePicker
                                format={'YYYY-MM-DD'}
                                disabledDate={(current) =>
                                    current && current.valueOf() > Date.now()
                                }
                            />
                        </Form.Item>
                        <Form.Item
                            className='w-full flex-1'
                            rules={[
                                {
                                    required: true,
                                    message:
                                        'Ngày kết thúc không được để trống!',
                                },
                            ]}
                            name='toDate'
                            label='Đến ngày'
                            initialValue={moment()}
                        >
                            <DatePicker
                                format={'YYYY-MM-DD'}
                                disabledDate={(current) =>
                                    current && current.valueOf() > Date.now()
                                }
                            />
                        </Form.Item>
                    </div>
                    <Form.Item>
                        <div className='w-full flex gap-4 justify-center'>
                            <Button type='primary' htmlType='submit' loading={loadingExport}>
                                Ok
                            </Button>
                            <Button onClick={() => setShowPopupExport(false)}>
                                Cancel
                            </Button>
                        </div>
                    </Form.Item>
                </Form>
            </Modal>
        </section>
    );
}

export default LocationDetail;
