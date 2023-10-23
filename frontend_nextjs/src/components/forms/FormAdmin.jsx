import { PlusOutlined } from '@ant-design/icons';
import { Button, DatePicker, Form, Input, Select, Upload } from 'antd';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { GIOI_TINH } from '../../utils/constant';
import { getBase64 } from '../../utils/validator';

function FormAdmin({
    errorValue = {},
    form,
    onFinish,
    onFinishFailed,
    loading,
    isCreate,
    apiUpdateAvatar,
    avatar,
}) {
    const [file, setFile] = useState();
    const router = useRouter();
    const handleSubmit = (values) => {
        onFinish(values, file);
    };
    return (
        <Form
            form={form}
            onFinish={handleSubmit}
            onFinishFailed={onFinishFailed}
            layout='vertical'
        >
            <Upload
                fileList={[]}
                name='file'
                className='avatar-upload-input'
                listType={'picture-card'}
                showUploadList={false}
                customRequest={
                    // apiUpdateAvatar
                    ({ onSuccess, onError, file }) => {
                        getBase64(file, (file) => setFile(file));
                    }
                }
            >
                {avatar || file ? (
                    <img src={file || avatar} />
                ) : (
                    <div>
                        <PlusOutlined />
                        <div style={{ marginTop: 8 }}>Tải lên</div>
                    </div>
                )}
            </Upload>

            {isCreate && (
                <>
                    <Form.Item
                        name={'email'}
                        label={'Email'}
                        rules={[
                            {
                                required: true,
                                message: 'Email không được bỏ trống',
                            },
                        ]}
                    >
                        <Input placeholder='nhập email' />
                    </Form.Item>
                    <Form.Item
                        name={'password'}
                        label={'Mật khẩu'}
                        rules={[
                            {
                                required: true,
                                message: 'Vui lòng nhập password',
                            },
                        ]}
                    >
                        <Input placeholder='nhập password' type={'password'} />
                    </Form.Item>
                    <Form.Item
                        name={'password2'}
                        label={'Nhập lại mật khẩu'}
                        rules={[
                            {
                                required: true,
                                message: 'Vui lòng nhập lại password',
                            },
                            {
                                validator: (rule, value, callback) => {
                                    console.log(
                                        value,
                                        form.getFieldValue('password'),
                                        form.getFieldValue('password') !==
                                            value,
                                        'form.getFieldsValue("password")'
                                    );
                                    if (
                                        form.getFieldValue('password') !== value
                                    )
                                        callback(
                                            'Mật khẩu không đúng. Vui lòng kiểm tra lại'
                                        );
                                    else callback();
                                },
                            },
                        ]}
                    >
                        <Input
                            placeholder='nhập lại password'
                            type={'password'}
                        />
                    </Form.Item>
                </>
            )}
            <Form.Item
                name={'first_name'}
                label={'Họ'}
                rules={[
                    {
                        required: true,
                        message: 'Họ không được bỏ trống',
                    },
                ]}
            >
                <Input placeholder='nhập tên' />
            </Form.Item>
            <Form.Item
                name={'last_name'}
                label={'Tên'}
                rules={[
                    {
                        required: true,
                        message: 'Tên không được bỏ trống',
                    },
                ]}
            >
                <Input placeholder='nhập tên' />
            </Form.Item>
            <Form.Item name={'gender'} label={'Giới tính'}>
                <Select options={GIOI_TINH} placeholder='Chọn giới tính' />
            </Form.Item>
            <Form.Item name={'date_of_birth'} label={'Ngày sinh'}>
                <DatePicker
                    format={'DD/MM/YYYY'}
                    style={{ width: '100%' }}
                    placeholder='Nhập ngày sinh'
                />
            </Form.Item>
            <Form.Item name={'phone_number'} label={'Số điện thoại'}>
                <Input placeholder='nhập số điện thoại' />
            </Form.Item>
            <Form.Item name={'contact'} label={'Liên hệ'}>
                <Input placeholder='nhập liên hệ' />
            </Form.Item>
            <Form.Item>
                <div className='flex justify-center gap-4'>
                    <Button type='primary' htmlType='submit' loading={loading}>
                        Cập nhật
                    </Button>
                    <Button
                        onClick={() =>
                            router.push('/admin/manage-account/type-admin')
                        }
                        type='default'
                    >
                        Hủy
                    </Button>
                </div>
            </Form.Item>
        </Form>
    );
}

export default FormAdmin;
