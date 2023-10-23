import { PlusOutlined } from '@ant-design/icons';
import { Button, DatePicker, Form, Input, Select, Upload } from 'antd';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { APP_USER_TYPE, GIOI_TINH } from '../../utils/constant';
import { getBase64, validateEmail } from '../../utils/validator';
import { useQuery } from 'react-query';
import Manifest from '../../models/Manifest';
import UserType from '../../models/UserType';

function FormCustomer({
    form,
    onFinish,
    onFinishFailed,
    loading,
    isCreate,
    userType ,
    avatar,
}) {
    const [file, setFile] = useState();
    const router = useRouter();

    const handleSubmit = (values) => {
        onFinish(values, file);
    };

    const { data: listManifest, isLoading: loadingListManifest } = useQuery(
        'getListManifest',
        async () => {
            const result = await Manifest.search({
                user_type_id: userType,
            });
            return result?.rows;
        },
        {}
    );
    const linkBack = ()=>{
        if(userType === APP_USER_TYPE.ADMIN) return '/admin/manage-account/type-admin'
        if(userType === APP_USER_TYPE.CUSTOMER) return '/admin/manage-account/type-customer'
        if(userType === APP_USER_TYPE.ADMIN_LOCATION) return '/admin/manage-account/type-adminLocation'
    }
    return (
        <Form
            form={form}
            onFinish={handleSubmit}
            onFinishFailed={onFinishFailed}
            layout='vertical'
            scrollToFirstError
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

            <Form.Item
                name={'email'}
                label={'Email'}
                rules={[
                    validateEmail('Email chưa đúng định dạng'),
                    {
                        required: true,
                        message: 'Email không được bỏ trống',
                    },
                ]}
            >
                <Input disabled={!isCreate} placeholder='nhập email' />
            </Form.Item>
            <Form.Item
                label='Trạng thái hoạt động'
                name='is_active'
                initialValue={1}
                className='flex-1'
            >
                <Select className='w-full'>
                    <Select.Option value={1}>Hoạt động</Select.Option>
                    <Select.Option value={0}>Không hoạt động</Select.Option>
                </Select>
            </Form.Item>
            {isCreate && (
                <div className='flex gap-8'>
                    <Form.Item
                        className='flex-1'
                        name={'password'}
                        label={'Mật khẩu'}
                        rules={[
                            {
                                required: true,
                                message: 'Vui lòng nhập password',
                            },
                        ]}
                    >
                        <Input
                            autoComplete='new-password'
                            placeholder='nhập password'
                            type={'password'}
                        />
                    </Form.Item>
                    <Form.Item
                        className='flex-1'
                        name={'password2'}
                        label={'Nhập lại mật khẩu'}
                        rules={[
                            {
                                required: true,
                                message: 'Vui lòng nhập lại password',
                            },
                            {
                                validator: (rule, value, callback) => {
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
                </div>
            )}

            <Form.Item
                hidden
                className='flex-1'
                name={'user_type_id'}
                initialValue={userType}
                label={'loại tài khoản'}
            />
            <Form.Item
                className='flex-1'
                name='manifests'
                id='minifestInput'
                label='Quyền hạn của tài khoản'
            >
                <Select
                    optionFilterProp='label'
                    mode='multiple'
                    loading={loadingListManifest}
                >
                    {listManifest &&
                        listManifest.map((item) => (
                            <Select.Option
                                key={item.id}
                                value={item.id}
                                label={item.role_name}
                            >
                                <div className='flex gap-4 items-center'>
                                    {item.role_name}
                                    <span className='text-secondary text-sm'>
                                        ( {item.content} )
                                    </span>
                                </div>
                            </Select.Option>
                        ))}
                </Select>
            </Form.Item>

            <div className='flex gap-4'>
                <Form.Item
                    className='flex-1'
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
                    className='flex-1'
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
            </div>
            <div className='flex gap-4'>
                <Form.Item
                    name={'gender'}
                    className='flex-1'
                    label={'Giới tính'}
                >
                    <Select options={GIOI_TINH} placeholder='Chọn giới tính' />
                </Form.Item>
                <Form.Item
                    name={'date_of_birth'}
                    className='flex-1'
                    label={'Ngày sinh'}
                >
                    <DatePicker
                        format={'DD/MM/YYYY'}
                        style={{ width: '100%' }}
                        placeholder='Nhập ngày sinh'
                        disabledDate={(current) => {
                            return current && current.valueOf() > Date.now();
                        }}
                    />
                </Form.Item>
            </div>

            <Form.Item name={'phone_number'} label={'Số điện thoại'}>
                <Input placeholder='nhập số điện thoại' />
            </Form.Item>
            <Form.Item name={'contact'} label={'Liên hệ'}>
                <Input.TextArea size={5} placeholder='nhập liên hệ' />
            </Form.Item>
            <Form.Item>
                <div className='flex justify-center gap-4'>
                    <Button type='primary' htmlType='submit' loading={loading}>
                        {isCreate ? 'Tạo mới' : 'Cập nhật'}
                    </Button>
                    <Button
                        onClick={() =>
                            router.push(linkBack())
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

export default FormCustomer;
