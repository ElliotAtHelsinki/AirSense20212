import { useRouter } from 'next/router';
import { useMutation } from 'react-query';
import UrlBreadcrumb from '../../../src/components/common/UrlBreadcrumb';
import PageAdminLayout from '../../../src/components/PageAdminLayout';
import SensorDeviceTypeModel from '../../../src/models/SensorDeviceType';
import { useForm } from 'antd/lib/form/Form';
import FormSensorDeviceType from '../../../src/components/forms/FormSensorType';
import { notification } from 'antd';
import { formValidatorAfterSubmit } from '../../../src/utils/validator';

const CreateSensor = () => {
    const router = useRouter();
    const [form] = useForm();

    const updateManifestBread = [
        {
            name: 'Loại thiết bị',
        },
        {
            name: 'Danh sách loại thiết bị',
            url: '/admin/sensor-type',
        },
        {
            name: 'Thêm loại thiết bị',
        },
    ];

    const createSensorDeviceTypeMutation = useMutation(
        'createSensorDeviceType',
        (body) => SensorDeviceTypeModel.create(body),
        {
            onSuccess: async () => {
                notification.success({
                    message: "Tạo loại thiết bị thành công!",
                });
                router.push('/admin/sensor-type')
            },
            onError: (e) => {
                formValidatorAfterSubmit(form , e)
            },
        }
    );

    const onFinish = (values) => {
        createSensorDeviceTypeMutation.mutate(values);
    };

    return (
        <section>
            <UrlBreadcrumb breadcrumbs={updateManifestBread} />
            <PageAdminLayout pageName='Thêm loại thiết bị'>
                <FormSensorDeviceType
                    form={form}
                    isCreate={true}
                    onFinish={onFinish}
                    loading={createSensorDeviceTypeMutation.isLoading}
                />
            </PageAdminLayout>
        </section>
    );
};

export default CreateSensor;
