import { notification } from 'antd';
import { useRouter } from 'next/router';
import { useMutation } from 'react-query';
import UrlBreadcrumb from '../../../src/components/common/UrlBreadcrumb';
import PageAdminLayout from '../../../src/components/PageAdminLayout';
import SensorDeviceModel from '../../../src/models/SensorDevice';
import FormSensorDevice from '../../../src/components/forms/FormSensorDevice';
import { useForm } from 'antd/lib/form/Form';
import File from '../../../src/models/File';
import {
    dataUrlToFile,
    formValidatorAfterSubmit,
} from '../../../src/utils/validator';
import { useState } from 'react';

const CreateSensor = () => {
    const [form] = useForm();
    const router = useRouter();
    const updateManifestBread = [
        {
            name: 'Thiết bị',
        },
        {
            name: 'Danh sách thiết bị',
            url: '/admin/sensors',
        },
        {
            name: 'Thêm loại thiết bị',
        },
    ];
    const [loading, setLoading] = useState(false);

    const createSensorDeviceMutation = useMutation(
        'createSensorDevice',
        (body) => SensorDeviceModel.create(body),
        {
            onSuccess: async () => {
                notification.success({message: 'Tạo mới thiết bị thành công'});
                router.push('/admin/sensors')
            },
            onError: (e) => {
                formValidatorAfterSubmit(form , e)
                notification.error({message : 'Tạo mới thiết bị thất bại'});
            },
        }
    );

    const onFinish = (values) => {
        form.validateFields()
            .then((_formValue) => {
                if (values.file) {
                    File.uploadImage(dataUrlToFile(values.file, 'file'))
                        .then((res) => {
                            values.avatar = res.urls;
                            createSensorDeviceMutation.mutate(values);
                        })
                        .catch((e) => {
                            // console.log(e);
                            notification.error({
                                message: 'Tạo trạm quan trắc thất bại!',
                            });
                        });
                } else {
                    createSensorDeviceMutation.mutate(values);
                }
            })
            .catch((e) => {})
            .finally(() => setLoading(false));
    };

    return (
        <section>
            <UrlBreadcrumb breadcrumbs={updateManifestBread} />
            <PageAdminLayout pageName='Thêm thiết bị'>
                <FormSensorDevice
                    form={form}
                    onFinish={onFinish}
                    loading={createSensorDeviceMutation.isLoading}
                    isCreate={true}
                />
            </PageAdminLayout>
        </section>
    );
};

export default CreateSensor;
