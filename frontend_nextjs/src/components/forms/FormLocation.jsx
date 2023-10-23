import React, { useEffect, useState } from 'react';
import { Avatar, Button, DatePicker, Form, Input, Select, Upload } from 'antd';
import { useRouter } from 'next/router';
import { getBase64 } from '../../utils/validator';
import { PlusOutlined } from '@ant-design/icons';
import TextArea from 'antd/lib/input/TextArea';
import MapCreateLocation from '../MapCreateLocation';
import { useQuery } from 'react-query';
import SensorDevice from '../../models/SensorDevice';
import { requestParams } from '../../utils/constant';
import { uniqBy } from '../../utils/opLodash';

function FormLocation({
    form,
    initMarker,
    pickedSensor,
    onFinish,
    onFinishFailed,
    loading,
    isCreate,
    ...props
}) {
    const router = useRouter();
    const [file, setFile] = useState();
    const [marker, setMarker] = useState(initMarker);

    let { data: listSensor, isLoadingListSensor } = useQuery(
        ['getListSensorAvailable'],
        async () => {
            const data = await SensorDevice.search({
                size: 10000,
                location_id: requestParams.UNSET,
            });
            return isCreate
                ? data.rows
                : uniqBy(data.rows.concat(pickedSensor || []), 'id');
        }, {
            enabled : isCreate || (!isCreate && !!pickedSensor)
        }
    );


    useEffect(() => {
        setMarker(initMarker);
    }, [initMarker]);
    return (
        <Form
            form={form}
            onFinish={(value) => {
                value.file = file;
                value.latitude = marker.position.lat;
                value.longitude = marker.position.lng;
                onFinish(value);
            }}
            scrollToFirstError
            layout='vertical'
        >
            <Form.Item name='avatar'>
                <Upload
                    fileList={[]}
                    name='file'
                    className='avatar-upload-input'
                    listType={'picture-card'}
                    showUploadList={false}
                    customRequest={({ onSuccess, onError, file }) => {
                        getBase64(file, (file) => setFile(file));
                    }}
                >
                    {form.getFieldValue('avatar') || file ? (
                        <img src={file || form.getFieldValue('avatar')} />
                    ) : (
                        <div>
                            <PlusOutlined />
                            <div style={{ marginTop: 8 }}>Tải lên</div>
                        </div>
                    )}
                </Upload>
            </Form.Item>

            <Form.Item
                label='Tên trạm quan trắc'
                name='location_name'
                rules={[
                    {
                        required: true,
                        message: 'Tên trạm không được bỏ trống',
                    },
                ]}
            >
                <Input
                    className='rounded-xl'
                    placeholder='Tên trạm quan trắc'
                />
            </Form.Item>
            <Form.Item label='Địa điểm đặt trạm' name='address'>
                <Input className='rounded-xl' placeholder='Địa điểm đặt trạm' />
            </Form.Item>
            <Form.Item
                label='Chọn vị trí trạm trên bản đồ'
                rules={[
                    {
                        required: true,
                        message: 'Vị trí trạm không được bỏ trống',
                    },
                ]}
            >
                <MapCreateLocation
                    width='100%'
                    height='500px'
                    marker={marker}
                    setMarker={setMarker}
                />
            </Form.Item>
            <Form.Item
                name='sensorIds'
                label='Chọn danh sách thiết bị (chưa được gắn vào trạm )'
                id='sensorInput'
            >
                <Select
                    loading={isLoadingListSensor}
                    mode='multiple'
                    size='large'
                    optionFilterProp='label'
                >
                    {listSensor &&
                        listSensor.map((item, index) => (
                            <Select.Option
                                key={index}
                                value={item.id}
                                label={item.sensor_name}
                            >
                                <div className='flex gap-4 items-center'>
                                    <Avatar src={item.avatar} />
                                    {item.sensor_name}
                                    <span className='text-secondary text-sm'>
                                        ( {item.macId} )
                                    </span>
                                </div>
                            </Select.Option>
                        ))}
                </Select>
            </Form.Item>

            <Form.Item label='Mô tả' name='description'>
                <Input
                    className='rounded-xl'
                    placeholder='Mô tả trạm quan trắc'
                />
            </Form.Item>
            <div className='flex gap-6 '>
                <Form.Item
                    className='flex-1'
                    label='Trạng thái'
                    name='status'
                    initialValue={1}
                >
                    <Select>
                        <Select.Option value={1}>Thử nghiệm</Select.Option>
                        <Select.Option value={2}>Hoạt động</Select.Option>
                        {/*<Select.Option value={3}>Ngừng hoạt động</Select.Option>*/}
                    </Select>
                </Form.Item>
                <Form.Item
                    className='flex-1'
                    name='testing_date'
                    label='Ngày thử nghiệm'
                >
                    <DatePicker
                        style={{ width: '100%' }}
                        placeholder='Nhập ngày thử nghiệm'
                    />
                </Form.Item>
            </div>
            <Form.Item label='Liên hệ' name='contact'>
                <TextArea
                    rows={5}
                    className='rounded-xl'
                    placeholder='Thông tin liên hệ '
                />
            </Form.Item>

            <Form.Item>
                <div className='flex justify-center gap-4'>
                    <Button type='primary' htmlType='submit' loading={loading}>
                        {isCreate ? 'Tạo' : 'Cập nhật'}
                    </Button>
                    <Button
                        onClick={() => router.push('/admin/location')}
                        type='default'
                    >
                        Hủy
                    </Button>
                </div>
            </Form.Item>
        </Form>
    );
}

export default FormLocation;
