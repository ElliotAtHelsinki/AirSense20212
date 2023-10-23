import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { Button, Modal, Table, Tooltip } from 'antd';
import Link from 'next/link';
import { useMutation } from 'react-query';
import UrlBreadcrumb from '../../../src/components/common/UrlBreadcrumb';
import PageAdminLayout from '../../../src/components/PageAdminLayout';
import usePagination from '../../../src/hooks/usePagination';
import useUser from '../../../src/hooks/useUser';
import AIRSENSE from '../../../src/models/AIRSENSE';
import SensorDeviceType from '../../../src/models/SensorDeviceType';
import React from 'react';
import useQueryUrl from '../../../src/hooks/useQueryUrl';

const SensorList = () => {
    const { permissions } = useUser();

    const SensorTypeBread = [
        {
            name: 'Loại thiết bị',
        },
        {
            name: 'Danh sách loại thiết bị',
        },
    ];

    const CAN_CREATE_SENSOR_TYPE = AIRSENSE.canAccessFuture(
        'CREATE_SENSOR_TYPE',
        permissions
    );
    const CAN_UPDATE_SENSOR_TYPE = AIRSENSE.canAccessFuture(
        'UPDATE_SENSOR_TYPE',
        permissions
    );

    const CAN_DELETE_SENSOR_TYPE = AIRSENSE.canAccessFuture(
        'DELETE_SENSOR_TYPE',
        permissions
    );
    const query = useQueryUrl();

    const { configTable, page, pageSize, refetch, onChangeOneParam } =
        usePagination(
            (params) => SensorDeviceType.search(params),
        );

    const DeleteMutation = useMutation(
        'deleteSensorDeviceType',
        (id) => SensorDeviceType.delete(id),
        {
            onSuccess: async () => {
                refetch();
            },
            onError: (e) => {
                console.error(e);
                Modal.error({ title: 'Xóa loại thiết bị thất bại.' });
            },
        }
    );
    const columns = [
        {
            title: '#',
            render: (value, item, index) => (page - 1) * pageSize + index + 1,
        },
        {
            title: 'Tên loại thiết bị',
            dataIndex: 'type_name',
            key: 'type_name',
        },
        {
            title: 'Mô tả',
            dataIndex: 'description',
            key: 'description',
        },
        {
            title: 'Thời gian tạo',
            dataIndex: 'created_at',
            key: 'created_at',

        },
        {
            title: 'Thao tác',
            dataIndex: 'action',
            key: 'action',
            render: (value, record) => (
                <div className='flex gap-4 items-center'>
                    {CAN_UPDATE_SENSOR_TYPE && (
                        <Button type='text' size='small'>
                            <Link
                                href={`/admin/sensor-type/update/${record.id}`}
                                className='mr-2'
                            >
                                <Tooltip title='cập nhật'>
                                    <EditOutlined />
                                </Tooltip>
                            </Link>
                        </Button>

                    )}
                    {CAN_DELETE_SENSOR_TYPE && (
                        <Tooltip title='xóa'>
                            <Button type='text' size='small' disabled={record.system_default===1}>
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
                            </Button>

                        </Tooltip>
                    )}
                </div>
            ),
        },
    ];
    return (
        <section>
            <UrlBreadcrumb breadcrumbs={SensorTypeBread} />
            <PageAdminLayout pageName='Danh sách loại thiết bị'>
                <div className='flex justify-between gap-8'>
                    {CAN_CREATE_SENSOR_TYPE && (
                        <Button type='primary' className='ml-auto'>
                            <Link href='/admin/sensor-type/create'>
                                Thêm mới
                            </Link>
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
