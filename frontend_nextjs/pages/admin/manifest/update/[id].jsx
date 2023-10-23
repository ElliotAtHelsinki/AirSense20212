import React, { useState } from 'react';
import { useRouter } from 'next/router';
import UrlBreadcrumb from '../../../../src/components/common/UrlBreadcrumb';
import PageAdminLayout from '../../../../src/components/PageAdminLayout';
import { useMutation, useQuery } from 'react-query';
import ManifestModel from '../../../../src/models/Manifest';
import { notification, Spin } from 'antd';
import { useForm } from 'antd/lib/form/Form';
import FormManifest from '../../../../src/components/forms/FormManifest';
import { formValidatorAfterSubmit } from '../../../../src/utils/validator';

function ManifestDetail({ ...props }) {
    const router = useRouter();
    const { id } = router.query;
    const [form] = useForm();
    const [defaultCheckPermission , setDefaultCheckPermission] = useState([])
    const { isLoading } = useQuery(
        'getDetailManifest',
        () => ManifestModel.detail(id),
        {
            enabled: !!id,
            onSuccess: (data) => {
                setDefaultCheckPermission(data.Permissions.map(item=>item.id))
                form.setFieldsValue(data);
                // // trải phẳng data
                // let temp = {role_name : data.role_name}
                // form.setFieldsValue(temp)
            },
        }
    );
    const updateManifestMutation = useMutation(
        'updateManifest',
        (body) => ManifestModel.update(id, body),
        {
            onSuccess: () => {
                notification.success({
                    message: 'Cập nhật chức vụ thành công',
                });
                router.push('/admin/manifest');
            },
            onError: (e) => {
                formValidatorAfterSubmit(form, e);
                notification.error({ message: 'Cập nhật chức vụ thất bại' });
            },
        }
    );

    const updateManifestBread = [
        {
            name: 'Phân quyền',
        },
        {
            name: 'Danh sách chức vụ',
            url: '/admin/manifest',
        },
        {
            name: 'Cập nhật chức vụ',
        },
    ];
    const onFinish = () => {
        form.validateFields().then(res=>{
            updateManifestMutation.mutate(res)
        }).catch(e=>{})
    };

    return (
        <section>
            <UrlBreadcrumb breadcrumbs={updateManifestBread} />
            <PageAdminLayout pageName='Cập nhật chức vụ'>
                <Spin spinning={isLoading}>
                    <FormManifest
                        defaultCheckPermission={defaultCheckPermission}
                        form={form}
                        onFinish={onFinish}
                        loading={updateManifestMutation.isLoading}
                        isCreate={false}
                    />
                </Spin>
            </PageAdminLayout>
        </section>
    );
}

export default ManifestDetail;