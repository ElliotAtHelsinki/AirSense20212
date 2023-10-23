import React, { useState } from 'react';
import UrlBreadcrumb from '../../../src/components/common/UrlBreadcrumb';
import PageAdminLayout from '../../../src/components/PageAdminLayout';
import { notification, Spin } from 'antd';
import FormLocation from '../../../src/components/forms/FormLocation';
import { useForm } from 'antd/lib/form/Form';
import { useMutation } from 'react-query';
import LocationModel from '../../../src/models/Location';
import File from '../../../src/models/File';
import {
    dataUrlToFile,
    formValidatorAfterSubmit,
} from '../../../src/utils/validator';
import { useRouter } from 'next/router';
import { HANOI_LOCATION } from '../../../src/utils/constant';


function Create({...props}) {
    const [form] = useForm();
    const router = useRouter()
    const [loading , setLoading] = useState(false)
    const createLocationBread = [
        {
            name: "Trạm quan trắc",
        },
        {
            name: "Danh sách trạm quan trắc",
            url: "/admin/location",
        },
        {
            name: "Thêm mới trạm",
        },
    ];
    const createLocationMutation = useMutation(
        "createLocation",
        (body) => LocationModel.create(body),
        {
            onSuccess: () => {
                notification.success({
                    message: "Tạo trạm quan trắc thành công!",
                });
                router.push('/admin/location')
            },
            onError: (e) => {
                formValidatorAfterSubmit(form , e)
                // console.log(form.getFieldsError())
                // notification.error({
                //     message: "Tạo trạm quan trắc thất bại!",
                // });
            },
        }
    );
    const onFinish = (values) => {
        setLoading(true)
        form.validateFields().then(_formValue => {
            if (values.file) {
                File.uploadImage(dataUrlToFile(values.file, 'file')).then(res => {
                    values.avatar = res.urls;
                    createLocationMutation.mutate(values)
                }).catch(e => {
                    // console.log(e);
                    notification.error({
                        message: "Tạo trạm quan trắc thất bại!",
                    });
                })
            } else {
                createLocationMutation.mutate(values)
            }

        }).catch(e => {
        }).finally(()=>setLoading(false))
    };


    return (
        <section>
            <UrlBreadcrumb breadcrumbs={createLocationBread}/>
            <PageAdminLayout pageName='Thêm mới trạm quan trắc'>
                <Spin spinning={loading}>
                    <FormLocation
                        initMarker={HANOI_LOCATION}
                        isCreate
                        form={form}
                        onFinish={onFinish}
                        // onFinishFailed={onFinishFailed}
                        loading={createLocationMutation.isLoading}
                    />
                </Spin>
            </PageAdminLayout>
        </section>
    );
}

export default Create;
