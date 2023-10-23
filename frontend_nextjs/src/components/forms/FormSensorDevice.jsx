import React, { useEffect, useState } from "react";
import { useRouter } from 'next/router';
import { Button, Form, Input, Select, Upload } from 'antd';
import { useQuery } from 'react-query';
import SensorDeviceType from '../../models/SensorDeviceType';
import Location from '../../models/Location';
import { formatNormalizeNumber, getBase64 } from '../../utils/validator';
import { PlusOutlined } from '@ant-design/icons';

function FormSensorDevice({ form, onFinish, isCreate, loading, ...props }) {
    const router = useRouter();
    const [file, setFile] = useState();

    const { data: listDeviceType, isLoading: loadingListType } = useQuery(
        'getListDeviceType',
        () => SensorDeviceType.search({ size: 10000 }),
        {}
    );
    const { data: listLocation, isLoading: loadingListLocation } = useQuery(
        'getListLocation',
        () => Location.search({ size: 10000 }),
        {}
    );
    const [allowActiveSensor, setAllowActive] = useState(false);
   function handleAllowActive(){
        // console.log(form.getFieldValue('location_id'));
        if(form.getFieldValue('location_id') ) setAllowActive(true)
        else {
            setAllowActive(false)
            form.setFields([{name : 'is_active' , value : 0}])
        }
    }
    return (
        <Form
            form={form}
            onFinish={(value) => {
                if(value.unit === '1'){
                    value.step_time = value.step_time*1000
                }
                if(value.unit === '2'){
                    value.step_time = value.step_time* 1000* 60
                }
                // console.log(value);
                value.file = file
                onFinish(value)
            }}
            scrollToFirstError
            layout='vertical'
        >
            <Form.Item name='avatar' >
                <Upload
                    fileList={[]}
                    name='file'
                    className='avatar-upload-input'
                    listType={"picture-card"}
                    showUploadList={false}
                    customRequest={
                        ({onSuccess, onError, file}) => {
                            getBase64(file, (file) => setFile(file));
                        }
                    }
                >
                    {form.getFieldValue('avatar') || file ? (
                        <img src={file || form.getFieldValue('avatar')}/>
                    ) : (
                        <div>
                            <PlusOutlined/>
                            <div style={{marginTop: 8}}>Tải lên</div>
                        </div>
                    )}
                </Upload>
            </Form.Item>
            <Form.Item
                label='Tên của thiết bị'
                name='sensor_name'
            >
                <Input
                    className='rounded-xl'
                    placeholder='Tên của thiết bị'
                />
            </Form.Item>
            <Form.Item
                label='Địa chỉ MAC của thiết bị'
                name='macId'
                rules={[
                    {
                        required: true,
                        message: 'Địa chỉ MAC không được bỏ trống',
                    },
                ]}
            >
                <Input
                    className='rounded-xl'
                    placeholder='Địa chỉ MAC của thiết bị'
                />
            </Form.Item>
            <div className='flex gap-4 justify-between'>
                <Form.Item
                    label='Loại của thiết bị'
                    name='device_type'
                    rules={[
                        {
                            required: true,
                            message: 'Loại của thiết bị không được bỏ trống',
                        },
                    ]}
                    className='flex-1'
                >
                    <Select loading={loadingListType} className='w-full'>
                        {listDeviceType?.rows?.map((item, index) => (
                            <Select.Option value={item.id} key={item.id}>
                                {item?.type_name}
                            </Select.Option>
                        ))}
                    </Select>
                </Form.Item>
                <Form.Item
                    label='Trạm hoạt động của thiết bị'
                    name='location_id'
                    className='flex-1'
                >
                    <Select loading={loadingListType} className='w-full' onChange={()=>handleAllowActive()} allowClear>
                        {listLocation?.rows?.map((item, index) => (
                            <Select.Option value={item.id} key={item.id}>
                                {item?.location_name}
                            </Select.Option>
                        ))}
                    </Select>
                </Form.Item>
            </div>

            <div className='flex gap-4 justify-between'>
                <Form.Item
                    label='Trạng thái hoạt động'
                    name='is_active'
                    initialValue={0}
                    className='flex-1'

                >
                    <Select className='w-full'>
                        <Select.Option value={1} disabled={!allowActiveSensor}>Hoạt động</Select.Option>
                        <Select.Option value={0}>Không hoạt động</Select.Option>
                    </Select>
                </Form.Item>


                <Form.Item
                    label='Thời gian giữa 2 lần gửi bản tin của thiết bị '
                    name='step_time'
                    className='flex-1'
                    rules={[
                        {
                            required: true,
                            message: 'Thời gian gửi bản tin của thiết bị không được để trống',
                        },
                    ]}
                    normalize={formatNormalizeNumber}
                >

                    <Input placeholder='Nhập thời gian gửi bản tin của thiết bị' addonAfter={<Form.Item name='unit' noStyle initialValue='1'>
                        <Select defaultValue="1">
                            <Select.Option value="1">Giây</Select.Option>
                            <Select.Option value="2">Phút</Select.Option>
                        </Select>
                    </Form.Item>}/>

                </Form.Item>
            </div>
            <Form.Item>
                <div className='flex justify-center gap-4'>
                    <Button
                        type='primary'
                        htmlType='submit'
                        loading={loading}
                    >
                        {isCreate ? 'Tạo' : 'Cập nhật'}
                    </Button>
                    <Button onClick={() => router.push("/admin/sensors")} type='default'>
                        Hủy
                    </Button>
                </div>
            </Form.Item>
        </Form>
    );
}

export default FormSensorDevice;
