import { message, notification, Spin } from 'antd';
import { useForm } from 'antd/lib/form/Form';
import moment from 'moment';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { useMutation, useQuery } from 'react-query';
import UrlBreadcrumb from '../../../../src/components/common/UrlBreadcrumb';
import PageAdminLayout from '../../../../src/components/PageAdminLayout';
import LocationModel from '../../../../src/models/Location';
import FileModel from '../../../../src/models/File';
import FormLocation from '../../../../src/components/forms/FormLocation';
import { HANOI_LOCATION } from '../../../../src/utils/constant';
import {
    dataUrlToFile,
    formValidatorAfterSubmit,
} from '../../../../src/utils/validator';

const updateLocationBread = [
    {
        name: 'Trạm quan trắc',
    },
    {
        name: 'Danh sách trạm quan trắc',
        url: '/admin/location',
    },
    {
        name: 'Cập nhật trạm',
    },
];

function LocationEditPage({ ...props }) {
    const router = useRouter();
    const { id } = router.query;
    const [form] = useForm();
    const [marker, setMarker] = useState(HANOI_LOCATION);
    const [isUpdating, setUpdating] = useState(false);
    const { data : locationData , isLoading } = useQuery(
        'getDetailLocation',
        () => LocationModel.detail(id),
        {
            enabled: !!id,
            onSuccess: (data) => {
                setMarker({
                    position: { lat: data.latitude, lng: data.longitude },
                    name: data.address,
                });
                if (data.testing_date)
                    data.testing_date = moment(data.testing_date);
                data.sensorIds = data?.SensorDevices?.map(item=>item.id)||[]
                form.setFieldsValue({ ...data });
            },
        }
    );
    const updateLocationMutation = useMutation(
        'updateLocation',
        (body) => LocationModel.update(id, body),
        {
            onSuccess: (data) => {
                if (data.status === 'ok') {
                    message.success(data.msg);
                    router.push('/admin/location');
                }
            },
            onError: (e) => {
                notification.error({
                    message: 'Cập nhật trạm quan trắc thất bại!',
                });
                formValidatorAfterSubmit(form, e);
            },
        }
    );

    const onFinish = (body) => {
        setUpdating(true);
        form.validateFields()
            .then((_values) => {
                if (typeof body.avatar === 'string') {
                    updateLocationMutation.mutate(body);
                } else if (body.file) {
                    FileModel.uploadImage(dataUrlToFile(body.file, 'file'))
                        .then((res) => {
                            body.avatar = res.urls;
                            const temp = {...body}
                            delete temp.file
                            updateLocationMutation.mutate(temp);
                        })
                        .catch((e) => {
                            // console.log(e);
                            notification.error({
                                message: 'Cập nhật trạm quan trắc thất bại!',
                            });
                        });
                }
            })
            .catch((e) => {})
            .finally(() => setUpdating(false));
    };
    return (
        <section>
            <UrlBreadcrumb breadcrumbs={updateLocationBread} />
            <PageAdminLayout pageName='Cập nhật trạm quan trắc'>
                <Spin spinning={isLoading}>
                    <FormLocation
                        isCreate={false}
                        pickedSensor={locationData?.SensorDevices}
                        initMarker={marker}
                        form={form}
                        onFinish={onFinish}
                        loading={isUpdating}
                    />
                </Spin>
            </PageAdminLayout>
        </section>
    );
}

export default LocationEditPage;
