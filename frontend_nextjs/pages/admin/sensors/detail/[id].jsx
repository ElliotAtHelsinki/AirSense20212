import React from 'react';
import { useRouter } from 'next/router';
import UrlBreadcrumb from '../../../../src/components/common/UrlBreadcrumb';
import PageAdminLayout from '../../../../src/components/PageAdminLayout';
import { useQuery } from 'react-query';
import { Avatar, Descriptions, Spin, Tag } from 'antd';
import { AndroidOutlined } from '@ant-design/icons';
import SensorDevice from '../../../../src/models/SensorDevice';
import { SENSOR_STATUS } from '../../../../src/utils/constant';
import moment from 'moment';

const detailAdminBread = [
    {
        name: 'Quản lý thiết bị',
    },
    {
        name: 'Danh sách thiết bị',
        url: '/admin/sensors',
    },
    {
        name: 'Chi tiết thiết bị',
    },
];

function SensorDetail({ ...props }) {
    const router = useRouter();
    const { id } = router.query;

    const { data, isLoading } = useQuery(
        'getDetailSensor',
        () => SensorDevice.detail(id),
        {
            enabled: !!id,
        }
    );

    return (
        <section>
            <UrlBreadcrumb breadcrumbs={detailAdminBread} />
            <PageAdminLayout pageName='Chi tiết thiết bị'>
                <Spin spinning={isLoading}>
                    {data && (
                        <>
                            <div className='w-full text-center pt-4 pb-8'>
                                <Avatar
                                    size={{ md: 60, lg: 80, xl: 120, xxl: 150 }}
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
                                {/* row 1*/}
                                <Descriptions.Item
                                    label='Địa chỉ MAC'
                                    labelStyle={{ fontWeight: 700 }}
                                >
                                    {data?.macId}
                                </Descriptions.Item>
                                <Descriptions.Item
                                    label='Loại thiết bị'
                                    labelStyle={{ fontWeight: 700 }}
                                >
                                    {data?.SensorDeviceType?.type_name}
                                </Descriptions.Item>
                                <Descriptions.Item label='Trạm quan trắc'>
                                    {data?.Location?.location_name}
                                </Descriptions.Item>

                                {/* row 2*/}
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
                                <Descriptions.Item label='Thời gian gửi tin'>
                                    {data?.step_time}
                                </Descriptions.Item>
                                <Descriptions.Item label='Khởi Tạo lúc'>
                                    {moment(data?.created_at).format('LLL')}
                                </Descriptions.Item>
                                <Descriptions.Item label='Cập nhật gần nhất vào lúc'>
                                    {moment(data?.updated_at).format('LLL')}
                                </Descriptions.Item>
                            </Descriptions>
                        </>
                    )}
                </Spin>
            </PageAdminLayout>
        </section>
    );
}

export default SensorDetail;
