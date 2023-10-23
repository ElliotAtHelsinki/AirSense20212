import { UserOutlined } from '@ant-design/icons';
import {
    Avatar,
    Button,
    DatePicker,
    Form,
    Input,
    Select,
    Spin,
    Tag,
} from 'antd';
import { useForm } from 'antd/lib/form/Form';
import React, { useState } from 'react';
import { useMutation, useQuery } from 'react-query';
import { validatePhoneNumber2 } from '../../utils/validator';
import getUserProfile from '../../models/User';
import moment from 'moment';
import avatarChange from '../../models/Avatar';
import { ProfileWrapper } from './styled/ProfileWrapper';
import { notification } from 'antd';
import Manifest from '../../models/Manifest';

const { Option } = Select;
const FormChangeProfile = ({ user  }) => {
    const [formProfile] = useForm();
    const [avatar, setAvatar] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const { data, error, refetch } = useQuery(
        "userInfo",
        () => getUserProfile.getInfo(),
        {
            onSuccess: (res) => {
                formProfile.setFieldsValue({
                    firstName: res.first_name,
                    lastName: res.last_name,
                    email: res.email,
                    dob: res.date_of_birth && moment(res.date_of_birth),
                    gender: res.gender,
                    contact: res.contact,
                    phone_number: res.phone_number,
                });
                // console.log(res);
                setAvatar(res.avatar);
                setIsLoading(false);
            },
            onError: () => {
                setIsLoading(false);
            },
        }
    );
    const changeProfile = useMutation(
        'changeProfile',
        (body) => getUserProfile.changeProFile(body, user.id),
        {
            onSuccess: (res) => {
                notification.success({
                    message: 'Cập nhật thông tin thành công!',
                });
                refetch();
                setIsLoading(false);
            },
            onError: (err) => {
                notification.error({
                    message: 'Cập nhật thông tin thất bại!',
                });
                setIsLoading(false);
            },
        }
    );
    const upLoadAvatar = useMutation(
        'upLoadAvatar',
        (body) => avatarChange.apiPost(`/upload-image`, body),
        {
            onSuccess: (res) => {
                notification.success({
                    message: 'Tải ảnh thành công!',
                });
                setAvatar(res.urls);
                setIsLoading(false);
            },
            onError: (err) => {
                notification.error({
                    message: 'Tải ảnh thất bại!',
                });
                setIsLoading(false);
            },
        }
    );
    const changeAvatar = (event) => {
        if (event.target.files && event.target.files[0]) {
            let render = new FileReader();
            render.onload = (e) => {
                setAvatar(e.target.result);
            };
            render.readAsDataURL(event.target.files[0]);
            const fd = new FormData();
            fd.append("file", event.target.files[0]);
            setIsLoading(true);
            upLoadAvatar.mutate(fd);
        }
    };
    const onFinish = async () => {
        setIsLoading(true);
        formProfile
            .validateFields()
            .then((values) => {
                let dataReq = {
                    first_name: values.firstName,
                    last_name: values.lastName,
                    email: values.email,
                    date_of_birth: values.dob
                        ? moment(values.dob).format("YYYY/MM/DD")
                        : null,
                    gender: values.gender,
                    contact: values.contact,
                    phone_number:  values.phone_number ,
                    avatar: avatar,
                };
                // console.log(dataReq);
                changeProfile.mutate(dataReq);
            })
            .catch((err) => {

            });
    };
    return (
        <ProfileWrapper>
            <Spin spinning={isLoading}>
                <div className='mt-20 flex tablet:block tablet:px-0 px-5 laptop2:gap-x-10 gap-x-20'>
                    <div className='profile_left'>
                        <div className='relative'>
                            <Avatar
                                className='avatar shadow-xl rounded-full mx-auto w-64 laptop:w-52 h-64 laptop:h-52 tablet:h-64 tablet:w-64'
                                icon={!data?.avatar && <UserOutlined />}
                                src={avatar && avatar}
                            />
                            <input
                                className='z-50 opacity-0 hover:cursor-pointer top-0 left-0 tablet:translate-x-50 tablet:inset-x-1/2 tablet:w-64 tablet:h-64  w-full h-full absolute rounded-full'
                                type='file'
                                onChange={changeAvatar}
                                accept='.png,.ipeg,.jpg'
                            />
                        </div>
                        <h3 className='text-center tablet:mb-10 mt-6 font-semibold text-xl'>
                            {data?.last_name}
                        </h3>
                    </div>
                    <div className='profile_right tablet:w-4/5 w-3/5 mobile:w-full'>
                        <Form
                            form={formProfile}
                            name='profile'
                            labelCol={{ span: 8 }}
                            wrapperCol={{ span: 16 }}
                            onFinish={onFinish}
                            autoComplete='off'
                        >
                            <Form.Item
                                label='First Name:'
                                name='firstName'
                                rules={[
                                    {
                                        required: true,
                                        message: "Họ không được để trống!",
                                    },
                                ]}
                            >
                                <Input
                                    className='rounded-lg'
                                    placeholder='Nhập họ '
                                />
                            </Form.Item>
                            <Form.Item
                                label='Last Name:'
                                name='lastName'
                                rules={[
                                    {
                                        required: true,
                                        message: "Tên không được để trống!",
                                    },
                                ]}
                            >
                                <Input
                                    className='rounded-lg'
                                    placeholder='Nhập tên'
                                />
                            </Form.Item>
                            <Form.Item label='Email:' name='email'>
                                <Input disabled className='rounded-lg' />
                            </Form.Item>
                            <Form.Item
                                className='flex-1'
                                // name='manifests'
                                id='minifestInput'
                                label='Quyền hạn của tài khoản'
                            >
                                <div className='flex w-full gap-4 justify-start'>
                                    {data?.Manifests?.map((item) => (
                                        <Tag key={item.id} color='blue'>
                                            {item.role_name}
                                        </Tag>
                                    ))}
                                </div>
                            </Form.Item>
                            <Form.Item
                                className='flex-1'
                                // name={'user_type_id'}
                                // initialValue={userType}
                                label={'Loại tài khoản'}
                            >
                                <Input
                                    value={data?.UserType?.vi_name}
                                    disabled
                                />
                            </Form.Item>
                            <Form.Item
                                label='Ngày sinh'
                                name='dob'
                                className='date'
                            >
                                <DatePicker />
                            </Form.Item>
                            <Form.Item label='Giới tính' name='gender'>
                                <Select
                                    placeholder='Chọn một trong số các lựa chọn'
                                    defaultValue={null}
                                >
                                    <Option value={1}>Nam</Option>
                                    <Option value={2}>Nữ</Option>
                                </Select>
                            </Form.Item>

                            <Form.Item label='Địa chỉ liên hệ:' name='contact'>
                                <Input
                                    className='rounded-lg'
                                    placeholder='Nhập thông tin liên hệ'
                                />
                            </Form.Item>
                            <Form.Item
                                label='Số điện thoại:'
                                name='phone_number'
                                rules={[
                                    validatePhoneNumber2(
                                        'Số điện thoại không đúng định dạng'
                                    ),
                                ]}
                            >
                                <Input
                                    className='rounded-lgh'
                                    placeholder='Nhập số điện thoại'
                                />
                            </Form.Item>

                            <Form.Item className='justify-center'>
                                <Button
                                    type='primary'
                                    htmlType='submit'
                                    className='rounded-lg mt-10 w-30'
                                >
                                    Submit
                                </Button>
                            </Form.Item>
                        </Form>
                    </div>
                </div>
            </Spin>
        </ProfileWrapper>
    );
};

export default FormChangeProfile;
