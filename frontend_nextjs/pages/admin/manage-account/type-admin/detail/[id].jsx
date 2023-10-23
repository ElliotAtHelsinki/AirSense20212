import React from "react";
import { useRouter } from "next/router";
import UrlBreadcrumb from "../../../../../src/components/common/UrlBreadcrumb";
import PageAdminLayout from "../../../../../src/components/PageAdminLayout";
import { useQuery } from "react-query";
import AdminModel from "../../../../../src/models/Admin";
import { Avatar, Descriptions, Empty, Spin, Tag } from "antd";
import { GENDER, GIOI_TINH, SENSOR_STATUS } from "../../../../../src/utils/constant";
import { UserOutlined } from "@ant-design/icons";
import NoData from "../../../../../src/components/common/NoData";
import moment from "moment";



function AdminDetail({ ...props }) {
    const router = useRouter();
    const { id } = router.query;

    const { data, isLoading } = useQuery(
        "getDetailAdmin",
        () => AdminModel.detail(id),
        {
            enabled: !!id,
        }
    );

    const detailAdminBread = [
        {
            name: "Quản lý tài khoản",
        },
        {
            name: "Danh sách quản trị viên",
            url: "/admin/manage-account/type-admin",
        },
        {
            name: "Chi tiết quản trị viên",
        },
    ];

    return (
        <section>
            <UrlBreadcrumb breadcrumbs={detailAdminBread} />
            <PageAdminLayout pageName='Chi tiết quản trị viên'>
                <Spin spinning={isLoading}>
                    <div className='w-full text-center pt-4 pb-8'>
                        <Avatar
                            size={{ md: 60, lg: 80, xl: 120, xxl: 150 }}
                            icon={<UserOutlined />}
                            src={data?.avatar}
                        />
                    </div>

                    <Descriptions
                        column={1}
                        bordered
                        layout='horizontal'
                        labelStyle={{ fontWeight: 700, textAlign: 'center' }}
                    >
                        {/* row 1*/}
                        <Descriptions.Item
                            label='Họ'
                            labelStyle={{ fontWeight: 700 }}
                        >
                            {data?.first_name}
                        </Descriptions.Item>
                        <Descriptions.Item label='Tên'>
                            {data?.last_name}
                        </Descriptions.Item>
                        <Descriptions.Item label='Email'>
                            {data?.email}
                        </Descriptions.Item>
                        <Descriptions.Item label='Trạng thái hoạt động'>
                            <Tag
                                color={
                                    SENSOR_STATUS[data?.is_active]
                                        ?.color
                                }
                            >
                                {SENSOR_STATUS[data?.is_active]?.label}
                            </Tag>
                        </Descriptions.Item>
                        <Descriptions.Item label='Số điện thoại'>
                            {data?.phone_number }
                        </Descriptions.Item>
                        <Descriptions.Item label='Loại tài khoản'>
                            {data?.UserType?.vi_name}
                        </Descriptions.Item>
                        <Descriptions.Item label='Chức vụ'>
                            {data?.Manifests.map((item) => (
                                <div key={item.id}>{item.role_name}</div>
                            )) }
                        </Descriptions.Item>
                        {/* row 2*/}
                        <Descriptions.Item label='Ngày sinh'>
                            {data?.date_of_birth }
                        </Descriptions.Item>
                        <Descriptions.Item label='Giới tính'>
                            {GENDER[data?.gender] }
                        </Descriptions.Item>
                        <Descriptions.Item label='Liên lạc' span={2}>
                            {data?.contact }
                        </Descriptions.Item>
                        {/* row 3*/}
                        <Descriptions.Item label='Ghi chú' span={4}>
                            {data?.note }
                        </Descriptions.Item>
                        <Descriptions.Item label='Khởi Tạo lúc'>
                            {moment(data?.created_at).format('LLL')}
                        </Descriptions.Item>
                        <Descriptions.Item label='Cập nhật gần nhất vào lúc'>
                            {moment(data?.updated_at).format('LLL')}
                        </Descriptions.Item>
                    </Descriptions>
                </Spin>
            </PageAdminLayout>
        </section>
    );
}

export default AdminDetail;
