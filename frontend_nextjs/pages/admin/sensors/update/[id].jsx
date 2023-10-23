import { notification, Spin } from 'antd';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { useMutation, useQuery } from 'react-query';
import UrlBreadcrumb from '../../../../src/components/common/UrlBreadcrumb';
import FormSensorDevice from '../../../../src/components/forms/FormSensorDevice';
import PageAdminLayout from '../../../../src/components/PageAdminLayout';
import SensorDeviceModel from '../../../../src/models/SensorDevice';
import { useForm } from 'antd/lib/form/Form';
import FileModel from '../../../../src/models/File';
import { dataUrlToFile } from '../../../../src/utils/validator';

const updateManifestBread = [
    {
        name: 'Thiết bị',
    },
    {
        name: 'Danh sách thiết bị',
        url: '/admin/sensors',
    },
    {
        name: 'Cập nhật thiết bị',
    },
];
const UpdateSensor = () => {
    const router = useRouter();
    const { id } = router.query;
    const [form] = useForm();
    const [isUpdating, setUpdating] = useState(false);

    const { isLoading } = useQuery(
        'getDetailSensorDevice',
        () => SensorDeviceModel.detail(id),
        {
            enabled: !!id,
            onSuccess: (data) => {
                form.setFieldsValue(data);
            },
        }
    );

    const updateSensorDeviceMutation = useMutation(
        'updateSensorDevice',
        (body) => SensorDeviceModel.update(id, body),
        {
            onSuccess: () => {
                notification.success({
                    message: 'Cập nhật thiết bị thành công!',
                });
                router.push('/admin/sensors')
            },
            onError: (e) => {
                notification.error({
                    message: 'Cập nhật thiết bị thất bại!',
                });
            },
        }
    );

    const onFinish = (body) => {
        setUpdating(true);
        form.validateFields()
            .then((_values) => {
                if (typeof body.avatar === 'string') {
                    updateSensorDeviceMutation.mutate(body);
                } else if (body.file) {
                    FileModel.uploadImage(dataUrlToFile(body.file, 'file'))
                        .then((res) => {
                            body.avatar = res.urls;
                            const temp = { ...body };
                            delete temp.file;
                            updateSensorDeviceMutation.mutate(temp);
                        })
                        .catch((e) => {
                            notification.error({
                                message: 'Cập nhật thiết bị thất bại!',
                            });
                        });
                }
            })
            .catch((e) => {})
            .finally(() => setUpdating(false));
    };

    return (
        <section>
            <UrlBreadcrumb breadcrumbs={updateManifestBread} />
            <PageAdminLayout pageName='Cập nhật thiết bị'>
                <Spin spinning={isLoading}>
                    <FormSensorDevice
                        form={form}
                        onFinish={onFinish}
                        loading={isUpdating}
                        isCreate={false}
                    />
                </Spin>
            </PageAdminLayout>
        </section>
    );
};

export default UpdateSensor;
