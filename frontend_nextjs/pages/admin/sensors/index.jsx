import {
    DeleteOutlined,
    EditOutlined,
    FileSearchOutlined,
    PlayCircleOutlined,
    SwitcherOutlined,
} from '@ant-design/icons';
import {
    Button,
    Menu,
    Modal,
    Popover,
    Select,
    Switch,
    Table, Tag,
    Tooltip,
} from "antd";
import Link from 'next/link';
import { useMutation } from 'react-query';
import UrlBreadcrumb from '../../../src/components/common/UrlBreadcrumb';
import PageAdminLayout from '../../../src/components/PageAdminLayout';
import usePagination from '../../../src/hooks/usePagination';
import useUser from '../../../src/hooks/useUser';
import AIRSENSE from '../../../src/models/AIRSENSE';
import SensorDeviceModel from '../../../src/models/SensorDevice';

import SearchCommon from '../../../src/components/common/SearchCommon';
import React, { useState } from 'react';
import useQueryUrl from '../../../src/hooks/useQueryUrl';
import { APP_SENSOR_TYPE_DEFAULT } from "../../../src/utils/constant";

const SensorList = () => {
    const { permissions } = useUser();

    const manifestBread = [
        {
            name: 'Thiết bị',
        },
        {
            name: 'Danh sách thiết bị',
        },
    ];

    const CAN_CREATE_SENSOR_DEVICE = AIRSENSE.canAccessFuture(
        'CREATE_SENSOR_DEVICE',
        permissions
    );
    const CAN_UPDATE_SENSOR_DEVICE = AIRSENSE.canAccessFuture(
        'UPDATE_SENSOR_DEVICE',
        permissions
    );

    const CAN_ACTIVE_SENSOR_DEVICE = AIRSENSE.canAccessFuture(
        'ACTIVE_SENSOR_DEVICE',
        permissions
    );
    const CAN_DETAIL_SENSOR_DEVICE = AIRSENSE.canAccessFuture(
        'DETAIL_SENSOR_DEVICE',
        permissions
    );
    const CAN_DELETE_SENSOR_DEVICE = AIRSENSE.canAccessFuture(
        'DELETE_SENSOR_DEVICE',
        permissions
    );
    const query = useQueryUrl();
    const [macIdSearch, setMacId] = useState(query.get('macId'));
    const [activeStatus, setActiveStatus] = useState(
        parseInt(query.get('is_active')) || null
    );
    const [locationIdSearch, setLocationIdSearch] = useState(
        parseInt(query.get('location_id')) || null
    );

    const { configTable, page, pageSize, refetch, onChangeOneParam } =
        usePagination(
            (params) => SensorDeviceModel.search(params),
            ['macId', 'is_active', 'location_id'],
            {
                macId: macIdSearch,
                is_active: activeStatus,
                location_id: locationIdSearch,
            }
        );
    const ToggleActiveMutation = useMutation(
        'toggleActive',
        ({macId,type}) => SensorDeviceModel.toggleActive(macId , type),
        {
            onSuccess: async () => {
                Modal.success({
                    title: 'Thay đổi trạng thái hoạt động của thiết bị thành công',
                });
                refetch();
            },
            onError: (e) => {
                console.error(e);
                Modal.error({
                    title: 'Thay đổi trạng thái hoạt động của thiết bị thất bại',
                });
            },
        }
    );
    const DeleteMutation = useMutation(
        'deleteSensorDevice',
        (id) => SensorDeviceModel.delete(id),
        {
            onSuccess: async () => {
                refetch();
            },
            onError: (e) => {
                console.error(e);
                Modal.error({ title: 'Xóa thiết bị thất bại.' });
            },
        }
    );
    const SwitchCpn = ({value , record, isDisable , type })=>{
        return <Switch
                    disabled={isDisable}
                    checked={value === 1}
                    onChange={() =>
                        Modal.confirm({
                            title: 'Bạn chắc chắn muốn thay đổi trạng thái ?',
                            onOk: () => {
                                ToggleActiveMutation.mutate({macId:record.macId , type});
                            },
                        })
                    }
                />
    }
    const columns = [
        {
            title: '#',
            render: (value, item, index) => (page - 1) * pageSize + index + 1,
        },
        {
            title: 'Tên thiết bị',
            dataIndex: 'sensor_name',
            key: 'sensor_name',
        },
        {
            title: 'Địa chỉ MAC',
            dataIndex: 'macId',
            key: 'macId',
        },
        {
            title: 'Trạm quan trắc',
            dataIndex: 'Location',
            key: 'Location',
            render: (value, item, index) => value?.location_name,
        },
        {
            title: 'Loại thiết bị',
            dataIndex: 'SensorDeviceType',
            key: 'SensorDeviceType',
            render: (value, item, index) => value?.type_name,
        },
        // {
        //     title: 'Bật/Tắt hoạt động',
        //     dataIndex: 'is_active',
        //     key: 'is_active',
        //     render: (value, record) => (
        //         <Switch
        //             disabled={!CAN_ACTIVE_SENSOR_DEVICE}
        //             checked={value === 1}
        //             onChange={() =>
        //                 Modal.confirm({
        //                     title: 'Bạn chắc chắn muốn thay đổi trạng thái hoạt động ?',
        //                     onOk: () => {
        //                         ToggleActiveMutation.mutate(record.id);
        //                     },
        //                 })
        //             }
        //         />
        //     ),
        // },
        {
            title: 'Thao tác',
            dataIndex: 'action',
            key: 'action',
            render: (value, record) => (
                <div className='flex gap-4 items-center'>
                    {CAN_DETAIL_SENSOR_DEVICE && (
                        <Link
                            href={`/admin/sensors/detail/${record.id}`}
                            passHref
                        >
                            <Tooltip title='chi tiết'>
                                <FileSearchOutlined />
                            </Tooltip>
                        </Link>
                    )}
                    {CAN_UPDATE_SENSOR_DEVICE && (
                        <Link
                            href={`/admin/sensors/update/${record.id}`}
                            className='mr-2'
                        >
                            <Tooltip title='cập nhật'>
                                <EditOutlined />
                            </Tooltip>
                        </Link>
                    )}
                    {CAN_DELETE_SENSOR_DEVICE && (
                        <Tooltip title='xóa'>
                            <DeleteOutlined
                                onClick={() =>
                                    Modal.confirm({
                                        title: 'Bạn chắc chắn muốn xóa ?',
                                        onOk: () => {
                                            DeleteMutation.mutate(record.id);
                                        },
                                    })
                                }
                            />
                        </Tooltip>
                    )}
                    {CAN_ACTIVE_SENSOR_DEVICE && (
                        <Tooltip title='Điều khiển '>
                            {
                                record.is_waiting_confirm === 1 ?
                                    <Tag color="geekblue">Pending</Tag>
                                    : <Popover
                                        content={
                                            <div className='flex flex-col gap-6'>
                                        <span className='flex justify-between gap-4'>
                                            <span>Hoạt động</span>

                                            <SwitchCpn value={record.is_active} record={record}
                                                       type={APP_SENSOR_TYPE_DEFAULT.CORE} isDisable={false} />
                                            </span>
                                                <span className='flex justify-between gap-4'>
                                            <span>Vòi phun nước</span>{' '}
                                                    <SwitchCpn value={record.is_pump} record={record}
                                                               type={APP_SENSOR_TYPE_DEFAULT.PUMP}
                                                               isDisable={record?.SensorDeviceType?.id !== APP_SENSOR_TYPE_DEFAULT.PUMP} />
                                        </span>
                                                <span className='flex justify-between gap-4'>
                                            <span>Còi cảnh báo </span>
                                            <SwitchCpn value={record.is_alarm} record={record}
                                                       type={APP_SENSOR_TYPE_DEFAULT.ALARM}
                                                       isDisable={record?.SensorDeviceType?.id !== APP_SENSOR_TYPE_DEFAULT.ALARM} />

                                        </span>
                                            </div>
                                        }
                                        trigger='click'
                                    >
                                        <PlayCircleOutlined />
                                    </Popover>
                            }
                        </Tooltip>
                    )}
                </div>
            ),
        },
    ];
    return (
        <section>
            <UrlBreadcrumb breadcrumbs={manifestBread} />
            <PageAdminLayout pageName='Danh sách thiết bị'>
                <div className='flex justify-between gap-8'>
                    <div className='flex gap-4 flex-grow'>
                        <SearchCommon
                            size='middle'
                            placeholder='Nhập địa chỉ MAC'
                            className='flex-1'
                            defaultValue={macIdSearch}
                            onSearch={(value) => {
                                setMacId(value);
                                onChangeOneParam('macId')(value);
                            }}
                        />

                        <Select
                            placeholder='Trạng thái hoạt động'
                            className='flex-1'
                            defaultValue={activeStatus}
                            onSelect={(value) => {
                                setActiveStatus(value);
                                onChangeOneParam('is_active')(value);
                            }}
                        >
                            <Select.Option value={null}>Tất cả</Select.Option>
                            <Select.Option value={1}>Bật</Select.Option>

                            <Select.Option value={0}>Tắt</Select.Option>
                        </Select>
                    </div>
                    {CAN_CREATE_SENSOR_DEVICE && (
                        <Button type='primary' className='ml-auto'>
                            <Link href='/admin/sensors/create'>Thêm mới</Link>
                        </Button>
                    )}
                </div>

                <Table
                    className='mt-8'
                    columns={columns}
                    {...configTable}
                    scroll={{
                        x: 1050,
                    }}
                />
            </PageAdminLayout>
        </section>
    );
};

export default SensorList;
