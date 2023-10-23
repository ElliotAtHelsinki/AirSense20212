import {
    DeleteOutlined,
    EditOutlined,
    FileSearchOutlined,
} from "@ant-design/icons";
import { Button, message, Modal, notification, Select, Switch, Table, Tooltip } from "antd";
import moment from "moment";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { useMutation } from "react-query";
import SearchCommon from "../../../../src/components/common/SearchCommon";
import UrlBreadcrumb from "../../../../src/components/common/UrlBreadcrumb";
import PageAdminLayout from "../../../../src/components/PageAdminLayout";
import usePagination from "../../../../src/hooks/usePagination";
import useQueryUrl from "../../../../src/hooks/useQueryUrl";
import useUser from "../../../../src/hooks/useUser";
import AIRSENSE from "../../../../src/models/AIRSENSE";
import CustomerModel from "../../../../src/models/Customer";
import { GIOI_TINH } from "../../../../src/utils/constant";

function Customer({ ...props }) {
    const router = useRouter();
    const customerBread = [
        {
            name: "Quản lý tài khoản",
        },
        {
            name: "Danh sách khách hàng",
        },
    ];
    const { permissions } = useUser();

    const CAN_CREATE_CUSTOMER = AIRSENSE.canAccessFuture(
        "CREATE_CUSTOMER",
        permissions
    );
    const CAN_UPDATE_CUSTOMER = AIRSENSE.canAccessFuture(
        "UPDATE_CUSTOMER",
        permissions
    );

    const CAN_ACTIVE_CUSTOMER = AIRSENSE.canAccessFuture(
        "ACTIVE_CUSTOMER",
        permissions
    );
    const CAN_DETAIL_CUSTOMER = AIRSENSE.canAccessFuture(
        "DETAIL_CUSTOMER",
        permissions
    );
    const CAN_DELETE_CUSTOMER = AIRSENSE.canAccessFuture(
        "DELETE_CUSTOMER",
        permissions
    );

    const query = useQueryUrl();
    const [searchEmail, setSearchEmail] = useState(query.get("email"));
    const [searchFirstname, setSearchFirstname] = useState(
        query.get("first_name")
    );
    const [searchLastName, setSearchLastName] = useState(
        query.get("last_name")
    );
    const [searchPhoneNumber, setSearchPhoneNumber] = useState(
        query.get("phone_number")
    );
    const [activeStatus, setActiveStatus] = useState(parseInt(query.get("is_active"))||null);
    const { configTable, page, pageSize, refetch, onChangeOneParam } =
        usePagination(
            (params) => CustomerModel.search(params),
            ["role_name", "is_active"],
            {
                email: searchEmail,
                first_name: searchFirstname,
                last_name: searchLastName,
                phone_number: searchPhoneNumber,
                is_active: activeStatus,
            }
        );
    const ToggleActiveMutation = useMutation(
        "toggleActive",
        (id) => CustomerModel.toggleActive(id),
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
        "deleteCustomer",
        (id) => CustomerModel.delete( id),
        {
            onSuccess: async (data) => {
                message.success(data.message || "Xóa thành công");
                refetch();
            },
            onError: (e) => {
                notification.error({ message: "Xóa người dùng thất bại" });

            },
        }
    );

    const column = [
        {
            title: "STT",
            width: 80,
            fixed: "left",
            render: (_, __, index) => index + 1,
        },
        {
            title: "Email",
            dataIndex: "email",
            key: "email",
            width: 240,
            fixed: "left",
        },
        {
            title: "Số điện thoại",
            dataIndex: "phone_number",
            key: "phone_number",
            width: 180,
        },
        {
            title: "Trạng thái",
            dataIndex: "is_active",
            key: "is_active",
            width: 200,
            render: (value, record) => (
                <Switch
                    disabled={!CAN_ACTIVE_CUSTOMER}
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
            width: 120,
            fixed: "right",
            render: (value, record) => (
                <div className='flex gap-4'>
                    {CAN_DETAIL_CUSTOMER && (
                        <Link
                            href={`/admin/manage-account/type-customer/detail/${record.id}`}
                            passHref
                        >
                            <Tooltip title='chi tiết'>
                                <FileSearchOutlined />
                            </Tooltip>
                        </Link>
                    )}
                    {CAN_UPDATE_CUSTOMER && (
                        <Link
                            href={`/admin/manage-account/type-customer/update/${record.id}`}
                            passHref
                        >
                            <Tooltip title='cập nhật'>
                                <EditOutlined />
                            </Tooltip>
                        </Link>
                    )}
                    {CAN_DELETE_CUSTOMER && (
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
            <UrlBreadcrumb breadcrumbs={customerBread} />
            <PageAdminLayout pageName='Danh sách khách hàng'>
                <div className='flex justify-between gap-8'>
                    <div className='flex gap-4 flex-grow'>
                        <SearchCommon
                            size='middle'
                            placeholder='Nhập email'
                            className='flex-1'
                            defaultValue={searchEmail}
                            onSearch={(value) => {
                                setSearchEmail(value);
                                onChangeOneParam("email")(value);
                            }}
                        />
                        <SearchCommon
                            size='middle'
                            placeholder='Nhập số điện thoại'
                            className='flex-1'
                            defaultValue={searchPhoneNumber}
                            onSearch={(value) => {
                                setSearchPhoneNumber(value);
                                onChangeOneParam("phone_number")(value);
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
                    {CAN_CREATE_CUSTOMER && (
                        <Button type='primary'>
                            <Link href='/admin/manage-account/type-customer/create'>
                                Thêm mới
                            </Link>
                        </Button>
                    )}
                </div>
                <Table
                    className='mt-8'
                    columns={column}
                    {...configTable}
                />
            </PageAdminLayout>
        </section>
    );
}

export default Customer;
