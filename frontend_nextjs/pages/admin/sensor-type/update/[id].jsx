import { notification, Spin } from 'antd';
import { useForm } from 'antd/lib/form/Form';
import { useRouter } from 'next/router';
import { useMutation, useQuery } from 'react-query';
import UrlBreadcrumb from '../../../../src/components/common/UrlBreadcrumb';
import PageAdminLayout from '../../../../src/components/PageAdminLayout';
import SensorDeviceType from '../../../../src/models/SensorDeviceType';
import { formValidatorAfterSubmit } from '../../../../src/utils/validator';
import FormSensorDeviceType from '../../../../src/components/forms/FormSensorType';

const updateSensorTypeBread = [
    {
        name: 'Loại thiết bị',
    },
    {
        name: 'Danh sách loại thiết bị',
        url: '/admin/sensor-type',
    },
    {
        name: 'Cập nhật loại thiết bị',
    },
];

function SensorTypeEditPage({ ...props }) {
    const router = useRouter();
    const { id } = router.query;
    const [form] = useForm();
    const { data: detailSensorType, isLoading } = useQuery(
        'getDetailSensorType',
        () => SensorDeviceType.detail(id),
        {
            enabled: !!id,
            onSuccess: (data) => {
                form.setFieldsValue({ ...data });
            },
        }
    );
    const updateSensorTypeMutation = useMutation(
        'updateSensorType',
        (body) => SensorDeviceType.update(id, body),
        {
            onSuccess: (data) => {
                router.push('/admin/sensor-type');
            },
            onError: (e) => {
                notification.error({
                    message: 'Cập nhật loại thiết bị thất bại!',
                });
                formValidatorAfterSubmit(form, e);
            },
        }
    );

    const onFinish = () => {
        form.validateFields()
            .then((values) => {
                updateSensorTypeMutation.mutate(values);
            })
            .catch((e) => {});
    };

    return (
        <section>
            <UrlBreadcrumb breadcrumbs={updateSensorTypeBread} />
            <PageAdminLayout pageName='Cập nhật loại thiết bị'>
                <Spin spinning={isLoading}>
                    <FormSensorDeviceType
                        initObj={detailSensorType}
                        form={form}
                        onFinish={onFinish}
                        loading={updateSensorTypeMutation.isLoading}
                        isCreate={false}
                    />
                </Spin>
            </PageAdminLayout>
        </section>
    );
}

export default SensorTypeEditPage;
