import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { Button, Form, Input } from 'antd';
import { isEqual } from '../../utils/opLodash';

function FormSensorDeviceType({
    form,
    onFinish,
    loading,
    isCreate,
    initObj,
    ...props
}) {
    const router = useRouter();
    // const [isDisable, setDisable] = useState(true);
    return (
        <Form
            form={form}
            onFinish={onFinish}
            scrollToFirstError
            layout='vertical'
            // onValuesChange={(_changeValue, allValue) => {
            //     const tmp = {
            //         type_name: initObj.type_name,
            //         description: initObj.description || '',
            //     };
            //     if (isEqual(tmp, allValue)) {
            //         setDisable(true);
            //     } else setDisable(false);
            // }}
        >
            <Form.Item
                label='Tên loại thiết bị'
                name='type_name'
                rules={[
                    {
                        required: true,
                        message: 'Tên loại thiết bị không được bỏ trống',
                    },
                ]}
            >
                <Input className='rounded-xl' placeholder='Tên loại thiết bị' />
            </Form.Item>
            <Form.Item label='Mô tả' name='description'>
                <Input.TextArea
                    className='rounded-xl'
                    placeholder='Mô tả'
                    size={5}
                />
            </Form.Item>
            <Form.Item>
                <div className='flex justify-center gap-4'>
                    <Button
                        type='primary'
                        htmlType='submit'
                        loading={loading}
                    >
                        {isCreate ? 'Tạo' : 'Cập nhật'}
                    </Button>
                    <Button
                        onClick={() => router.push('/admin/sensor-type')}
                        type='default'
                    >
                        Hủy
                    </Button>
                </div>
            </Form.Item>
        </Form>
    );
}

export default FormSensorDeviceType;
