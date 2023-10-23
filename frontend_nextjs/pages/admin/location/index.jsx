import React, { useState } from 'react';
import UrlBreadcrumb from '../../../src/components/common/UrlBreadcrumb';
import AIRSENSE from '../../../src/models/AIRSENSE';
import useUser from '../../../src/hooks/useUser';
import PageAdminLayout from '../../../src/components/PageAdminLayout';
import { Button, Modal, Select, Table, Tag, Tooltip } from 'antd';
import usePagination from '../../../src/hooks/usePagination';
import LocationModel from '../../../src/models/Location';
import { useRouter } from 'next/router';
import SearchCommon from '../../../src/components/common/SearchCommon';
import useQueryUrl from '../../../src/hooks/useQueryUrl';
import {
    DeleteOutlined,
    EditOutlined,
    FileSearchOutlined,
} from '@ant-design/icons';
import { useMutation } from 'react-query';
import Link from 'next/link';
import {
    FEATURE_PERMISSION,
    LOCATION_STATUS,
} from '../../../src/utils/constant';

function Location({ ...props }) {
    const router = useRouter();
    const LOCATIONBread = [
        {
            name: "Trạm quan trắc ",
        },
        {
            name: "Danh sách trạm quan trắc",
        },
    ];
    const { permissions } = useUser();

    const CAN_CREATE_LOCATION = AIRSENSE.canAccessFuture(
        FEATURE_PERMISSION.CREATE_LOCATION,
        permissions
    );
    const CAN_UPDATE_LOCATION = AIRSENSE.canAccessFuture(
        FEATURE_PERMISSION.UPDATE_LOCATION,
        permissions
    );

    const CAN_CHANGE_STATUS_LOCATION = AIRSENSE.canAccessFuture(
        FEATURE_PERMISSION.CHANGE_STATUS_LOCATION,
        permissions
    );
    const CAN_DETAIL_LOCATION = AIRSENSE.canAccessFuture(
        FEATURE_PERMISSION.DETAIL_LOCATION,
        permissions
    );
    const CAN_DELETE_LOCATION = AIRSENSE.canAccessFuture(
        FEATURE_PERMISSION.DELETE_LOCATION,
        permissions
    );

    const query = useQueryUrl();
    const [searchName, setSearchName] = useState(query.get("location_name"));
    const [activeStatus, setActiveStatus] = useState(parseInt(query.get("status")) || null);
    const { configTable, page, pageSize, refetch, onChangeOneParam } =
        usePagination(
            (params) => LocationModel.search(params),
            ["location_name", "status"],
            {
                location_name: searchName,
                status: activeStatus,
            }
        );
    const DeleteMutation = useMutation(
        "deleteLOCATION",
        (id) => LocationModel.delete(id),
        {
            onSuccess: async () => {
                refetch();
            },
            onError: (e) => {
                // console.log(e);
                // Modal.error({ title: "Thay đổi trạng thái thất bại" });
            },
        }
    );

    const column = [
        {
            title: "STT",
            dataIndex: "id",
            key: "id",
            render: (value, item, index) => (page - 1) * pageSize + index + 1,
        },
        {
            title: "Tên trạm",
            dataIndex: "location_name",
            key: "location_name",
        },
        {
            title: "Mô tả",
            dataIndex: "description",
            key: "description",
        },
        {
            title: "Trạng thái",
            dataIndex: "status",
            key: "status",
            render: (value, record) => (
                <Tag color={LOCATION_STATUS[value].color}>
                    {LOCATION_STATUS[value].label}
                </Tag>
            ),
        },
        {
            title: "Thao tác",
            key: "action",
            render: (value, record) => (
                <div className='flex gap-4'>
                    {CAN_DETAIL_LOCATION && (
                        <Link
                            href={`/admin/location/detail/${record.id}`}
                            passHref
                        >
                            <Tooltip title='chi tiết'>
                                <FileSearchOutlined />
                            </Tooltip>
                        </Link>
                    )}
                    {CAN_UPDATE_LOCATION && (
                        <Link
                            href={`/admin/location/update/${record.id}`}
                            passHref
                        >
                            <Tooltip title='cập nhật'>
                                <EditOutlined />
                            </Tooltip>
                        </Link>
                    )}
                    {CAN_DELETE_LOCATION && (
                        <Tooltip title='xóa'>
                            <DeleteOutlined
                                onClick={() =>
                                    Modal.confirm({
                                        title: "Bạn chắc chắn muốn xóa ?",
                                        onOk: () => {
                                            DeleteMutation.mutate(record.id);
                                        },
                                    })
                                }
                            />
                        </Tooltip>
                    )}
                </div>
            ),
        },
    ];
    return (
        <section>
            <UrlBreadcrumb breadcrumbs={LOCATIONBread} />
            <PageAdminLayout pageName='Danh sách trạm quan trắc'>
                <div className='flex justify-between gap-8'>
                    <div className='flex gap-4 flex-grow'>
                        <SearchCommon
                            size='middle'
                            placeholder='Nhập tên trạm'
                            className='flex-1'
                            defaultValue={searchName}
                            onSearch={(value) => {
                                setSearchName(value);
                                onChangeOneParam("location_name")(value);
                            }}
                        />
                        <Select
                            placeholder='Trạng thái hoạt động'
                            className='flex-1'
                            defaultValue={activeStatus}
                            onSelect={(value) => {
                                setActiveStatus(value);
                                onChangeOneParam("status")(value);
                            }}
                        >
                            <Select.Option value={null}>Tất cả</Select.Option>
                            <Select.Option value={1}>Thử nghiệm</Select.Option>
                            <Select.Option value={2}>Hoạt động</Select.Option>
                            <Select.Option value={3}>
                                Ngưng hoạt động
                            </Select.Option>
                        </Select>
                    </div>
                    {CAN_CREATE_LOCATION && (
                        <Button type='primary'>
                            <Link href='/admin/location/create'>Thêm mới</Link>
                        </Button>
                    )}
                </div>
                <Table
                    className='mt-8'
                    columns={column}
                    {...configTable}
                    scroll={{
                        x: 1050,
                    }}
                />
            </PageAdminLayout>
        </section>
    );
}

export default Location;
