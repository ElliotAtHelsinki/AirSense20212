import React, { useState } from 'react';
import UrlBreadcrumb from '../../../src/components/common/UrlBreadcrumb';
import AIRSENSE from '../../../src/models/AIRSENSE';
import useUser from '../../../src/hooks/useUser';
import PageAdminLayout from '../../../src/components/PageAdminLayout';
import {
    Button,
    Modal,
    notification,
    Select,
    Switch,
    Table,
    Tooltip,
} from 'antd';
import usePagination from '../../../src/hooks/usePagination';
import ManifestModel from '../../../src/models/Manifest';
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

function Manifest({ ...props }) {
    const router = useRouter();
    const manifestBread = [
        {
            name: "Phân quyền",
        },
        {
            name: "Danh sách phân quyền",
        },
    ];
    const { permissions } = useUser();

    const CAN_CREATE_MANIFEST = AIRSENSE.canAccessFuture(
        "CREATE_MANIFEST",
        permissions
    );
    const CAN_UPDATE_MANIFEST = AIRSENSE.canAccessFuture(
        "UPDATE_MANIFEST",
        permissions
    );

    const CAN_ACTIVE_MANIFEST = AIRSENSE.canAccessFuture(
        "ACTIVE_MANIFEST",
        permissions
    );
    const CAN_DETAIL_MANIFEST = AIRSENSE.canAccessFuture(
        "DETAIL_MANIFEST",
        permissions
    );
    const CAN_DELETE_MANIFEST = AIRSENSE.canAccessFuture(
        "DELETE_MANIFEST",
        permissions
    );

    const query = useQueryUrl();
    const [searchName, setSearchName] = useState(query.get("role_name"));
    const [activeStatus, setActiveStatus] = useState(parseInt(query.get("is_active")) || null);
    const { configTable, page, pageSize, refetch, onChangeOneParam } =
        usePagination(
            (params) => ManifestModel.search(params),
            ["role_name", "is_active"],
            {
                role_name: searchName,
                is_active: activeStatus,
            }
        );
    const ToggleActiveMutation = useMutation(
        "toggleActive",
        (id) => ManifestModel.toggleActive(id),
        {
            onSuccess: async () => {
                refetch();
            },
            onError: (e) => {
                notification.error({ message: "Thay đổi trạng thái thất bại" });

            },
        }
    );
    const DeleteMutation = useMutation(
        "deleteManifest",
        (id) => ManifestModel.delete(id),
        {
            onSuccess: async () => {
                refetch();
            },
            onError: (e) => {
                notification.error({ message: "Xóa quyền hạn thất bại" });
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
            title: "Tên quyền hạn",
            dataIndex: "role_name",
            key: "role_name",
        },
        {
            title: "Nội dung",
            dataIndex: "content",
            key: "content",
        },
        {
            title: "Trạng thái",
            dataIndex: "is_active",
            key: "is_active",
            render: (value, record) => (
                <Switch
                    disabled={!CAN_ACTIVE_MANIFEST}
                    checked={value === 1}
                    onChange={() =>
                        Modal.confirm({
                            title: "Bạn chắc chắn muốn thay đổi trạng thái hoạt động ?",
                            onOk: () => {
                                ToggleActiveMutation.mutate(record.id);
                            },
                        })
                    }
                />
            ),
        },
        {
            title: "Thao tác",
            key: "action",
            render: (value, record) => (
                <div className='flex gap-4'>
                    {CAN_DETAIL_MANIFEST && (
                        <Link href={`/admin/manifest/detail/${record.id}`} passHref>
                            <Tooltip title='chi tiết'>
                                <FileSearchOutlined />
                            </Tooltip>
                        </Link>
                    )}
                    {CAN_UPDATE_MANIFEST && (
                        <Link href={`/admin/manifest/update/${record.id}`} passHref>
                            <Tooltip title='cập nhật'>
                                <EditOutlined />
                            </Tooltip>
                        </Link>
                    )}
                    {CAN_DELETE_MANIFEST && (
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
            <UrlBreadcrumb breadcrumbs={manifestBread} />
            <PageAdminLayout pageName='Danh sách chức vụ'>
                <div className='flex justify-between gap-8'>
                    <div className='flex gap-4 flex-grow'>
                        <SearchCommon
                            size='middle'
                            placeholder='Nhập tên quyền hạn'
                            className='flex-1'
                            defaultValue={searchName}
                            onSearch={(value) => {
                                setSearchName(value);
                                onChangeOneParam("role_name")(value);
                            }}
                        />
                        <Select
                            placeholder='Trạng thái hoạt động'
                            className='flex-1'
                            defaultValue={activeStatus}
                            onSelect={(value) => {
                                setActiveStatus(value);
                                onChangeOneParam("is_active")(value);
                            }}
                        >
                            <Select.Option value={null}>Tất cả</Select.Option>
                            <Select.Option value={1}>Bật</Select.Option>
                            <Select.Option value={0}>Tắt</Select.Option>
                        </Select>
                    </div>
                    {CAN_CREATE_MANIFEST && (
                        <Button type='primary'>
                            <Link href='/admin/manifest/create'>Thêm mới</Link>
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

export default Manifest;
