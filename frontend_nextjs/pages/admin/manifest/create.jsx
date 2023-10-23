import React from 'react';
import UrlBreadcrumb from '../../../src/components/common/UrlBreadcrumb';
import PageAdminLayout from '../../../src/components/PageAdminLayout';
import { notification, Spin } from 'antd';
import FormManifest from '../../../src/components/forms/FormManifest';
import { useForm } from 'antd/lib/form/Form';
import { useMutation } from 'react-query';
import ManifestModel from '../../../src/models/Manifest';
import { formValidatorAfterSubmit } from '../../../src/utils/validator';
import { useRouter } from 'next/router';

function Create({ ...props }) {
    const [form] = useForm();
    const router = useRouter();
    const createManifestBread = [
        {
            name: 'Phân quyền',
        },
        {
            name: 'Danh sách chức vụ',
            url: '/admin/manifest',
        },
        {
            name: 'Thêm mới chức vụ',
        },
    ];
    const createManifestMutation = useMutation(
        'createManifest',
        (body) => ManifestModel.create(body),
        {
            onSuccess: () => {
                notification.success({
                    message: 'Tạo mới chức vụ thành công',
                });
                router.push('/admin/manifest');
            },
            onError: (e) => {
                formValidatorAfterSubmit(form, e);
                notification.error({ message: 'Tạo mới chức vụ thất bại' });
            },
        }
    );

    const onFinish = (values) => {
        // console.log('submit', values);
        form.validateFields()
            .then((value) => createManifestMutation.mutate(value))
            .catch((e) => {});
    };

    return (
        <section>
            <UrlBreadcrumb breadcrumbs={createManifestBread} />
            <PageAdminLayout pageName='Thêm mới chức vụ'>
                <Spin spinning={false}>
                    <FormManifest
                        form={form}
                        onFinish={onFinish}
                        loading={createManifestMutation.isLoading}
                        isCreate
                    />
                </Spin>
            </PageAdminLayout>
        </section>
    );
}

export default Create;
