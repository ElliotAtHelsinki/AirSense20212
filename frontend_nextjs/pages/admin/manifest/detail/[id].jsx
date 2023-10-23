import React, { useState } from 'react';
import { useRouter } from 'next/router';
import UrlBreadcrumb from '../../../../src/components/common/UrlBreadcrumb';
import PageAdminLayout from '../../../../src/components/PageAdminLayout';
import { useQuery } from 'react-query';
import ManifestModel from '../../../../src/models/Manifest';
import { Descriptions, Spin, Tag, Tree } from 'antd';
import moment from 'moment';
import { SENSOR_STATUS } from '../../../../src/utils/constant';

function ManifestDetail({ ...props }) {
    const router = useRouter();
    const { id } = router.query;
    const [accPermission , setAccPermission] = useState([])
    const { data, isLoading } = useQuery(
        'getDetailManifest',
        () => ManifestModel.detail(id),
        {
            enabled: !!id,
            onSuccess : (res)=>{
                const temp = []
                res.Permissions.forEach(permission=> {
                    if(!permission.parent_id) {
                        permission.children = [];
                        temp.push(permission)
                    }
                })
                temp.forEach(item=>{
                    res.Permissions.forEach(permission=>{
                        if(permission.parent_id === item.id) item.children.push(permission)
                    })
                })
                setAccPermission(temp)
            }
        }
    );
    const detailManifestBread = [
        {
            name: 'Phân quyền',
        },
        {
            name: 'Danh sách phân quyền',
            url: '/admin/manifest',
        },
        {
            name: 'Chi tiết quyền',
        },
    ];
    const [expandedKeyPm, setExpandedKeyPm] = useState([]);
    const [checkedKeyPm, setCheckedKeyPm] = useState([]);

    const onCheck = (checkedKeys, info) => {
        setCheckedKeyPm(checkedKeys);
        form.setFields([{ name: 'permissions', value: checkedKeys }]);
    };
    const onExpand = (expandedKeys, { expanded: bool, node }) => {
        setExpandedKeyPm(expandedKeys);
    };

    return (
        <section>
            <UrlBreadcrumb breadcrumbs={detailManifestBread} />
            <PageAdminLayout pageName='Chi tiết quyền hạn'>
                <Spin spinning={isLoading}>
                    <Descriptions
                        column={1}
                        bordered
                        layout='horizontal'
                        labelStyle={{
                            fontWeight: 700,
                            textAlign: 'center',
                        }}
                    >
                        <Descriptions.Item
                            label='Tên quyền hạn'
                            labelStyle={{ fontWeight: 700 }}
                        >
                            {data?.role_name}
                        </Descriptions.Item>
                        <Descriptions.Item
                            label='Trạng thái hoạt động'
                            labelStyle={{ fontWeight: 700 }}
                        >
                            <Tag color={SENSOR_STATUS[data?.is_active]?.color}>
                                {SENSOR_STATUS[data?.is_active]?.label}
                            </Tag>
                        </Descriptions.Item>
                        <Descriptions.Item
                            label='Nội dung'
                            labelStyle={{ fontWeight: 700 }}
                        >
                            {data?.content}
                        </Descriptions.Item>
                        <Descriptions.Item
                            label='Phạm vi quyền hạn'
                            labelStyle={{ fontWeight: 700 }}
                        >
                            <Tree
                                expandedKeys={expandedKeyPm}
                                checkedKeys={checkedKeyPm}
                                onCheck={onCheck}
                                onExpand={onExpand}
                                treeData={accPermission}
                                fieldNames={{
                                    title: 'vi_name',
                                    key: 'id',
                                    children: 'children',
                                }}
                            />
                        </Descriptions.Item>
                        <Descriptions.Item
                            label='Loại đối tượng áp dụng'
                            labelStyle={{ fontWeight: 700 }}
                        >
                            {data?.UserType?.vi_name}
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

export default ManifestDetail;
