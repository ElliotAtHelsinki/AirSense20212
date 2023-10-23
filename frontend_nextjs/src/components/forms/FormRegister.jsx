import React from 'react';
import { Button, Form, Input, notification, Tag } from 'antd';
import { CloseCircleOutlined } from '@ant-design/icons';
import { useRouter } from 'next/router';
import useUser from '../../hooks/useUser';
import { useMutation } from 'react-query';
import user from '../../models/User';
import {
    validateEmail,
    validatePassword,
    validatePhoneNumber2,
} from '../../utils/validator';
import { useForm } from 'antd/lib/form/Form';
import Link from 'next/link';

const FormRegister = ({ bgImage, routePass, ...props }) => {
    const styling = {
        backgroundImage: `url(${bgImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
    };
    const [registerForm] = useForm();
    const router = useRouter();
    const { changeUser } = useUser();
    const registerMutation = useMutation(
        "registorMutation",
        (body) => user.register(body),
        {
            onSuccess: (data) => {
                notification.success({
                    message: "Đăng kí tài khoản thành công",
                });
                changeUser(data);
                router.push(routePass);
            },
            onError: (err) => {
                notification.error({
                    message: err.error[0].email || err.error[0].phone_number,
                });
            },
        }
    );

    const onFinish = () => {
        registerForm.validateFields().then((values) => {
            let dataReq = {
                first_name: values.first_name,
                last_name: values.last_name,
                email: values.email,
                password: values.password,
                phone_number:
                    values.phone_number == "" ? null : values.phone_number,
            };
            // console.log(dataReq);
            registerMutation.mutate(dataReq);
        });
    };

    const onFinishFailed = (errorInfo) => {
        // console.log("Failed:", errorInfo);
    };
    return (
        <div className='h-screen w-screen flex items-center' style={styling}>
            <div className='container mx-auto w-1/3 tablet:w-11/12 bg-white px-6 py-12 rounded-xl drop-shadow-xl'>
                <h1 className='text-3xl font-bold text-primary mb-8 text-center'>
                    Đăng ký
                </h1>
                {registerMutation.error?.msg && (
                    <div className='w-full text-center my-4'>
                        <Tag
                            color='error'
                            icon={<CloseCircleOutlined />}
                            onClick={() => registerMutation.reset()}
                        >
                            {registerMutation.error?.msg}
                        </Tag>
                    </div>
                )}
                <Form
                    form={registerForm}
                    name='registerForm'
                    onFinish={onFinish}
                    initialValues={{ password: "", confirmPw: "" }}
                    onFinishFailed={onFinishFailed}
                    layout='vertical'
                >
                    <Form.Item
                        label='First Name'
                        name='first_name'
                        rules={[
                            {
                                required: true,
                                message: "Họ không được bỏ trống",
                            },
                        ]}
                    >
                        <Input className='rounded-xl' />
                    </Form.Item>
                    <Form.Item
                        label='Full Name'
                        name='last_name'
                        rules={[
                            {
                                required: true,
                                message: "Tên không được bỏ trống",
                            },
                        ]}
                    >
                        <Input className='rounded-xl' />
                    </Form.Item>
                    <Form.Item
                        label='Email'
                        name='email'
                        rules={[
                            {
                                required: true,
                                message: "Email không được bỏ trống",
                            },
                            validateEmail("Email không đúng định dạng!"),
                        ]}
                    >
                        <Input className='rounded-xl' />
                    </Form.Item>
                    <Form.Item
                        label='Password'
                        name='password'
                        rules={[
                            validatePassword("Mật khẩu không đúng định dạng"),
                            {
                                required: true,
                                message: "Mật khẩu mới không được bỏ trống!",
                            },
                        ]}
                    >
                        <Input.Password className='rounded-xl' />
                    </Form.Item>
                    <Form.Item
                        label='Confirm password'
                        name='confirmPassword'
                        dependencies={["password"]}
                        rules={[
                            {
                                required: true,
                                message: "Hãy nhập lại mật khẩu mới!",
                            },
                            ({ getFieldValue }) => ({
                                validator(_, value) {
                                    if (
                                        !value ||
                                        getFieldValue("password") === value
                                    ) {
                                        return Promise.resolve();
                                    }
                                    return Promise.reject(
                                        new Error(
                                            "Mật khẩu mới không trùng khớp!"
                                        )
                                    );
                                },
                            }),
                        ]}
                    >
                        <Input.Password className='rounded-xl' />
                    </Form.Item>
                    <Form.Item
                        label='Phone Number'
                        name='phone_number'
                        rules={[
                            validatePhoneNumber2(
                                "Số điện thoại không đúng định dạng"
                            ),
                        ]}
                    >
                        <Input className='rounded-xl' />
                    </Form.Item>
                    <Form.Item>
                        <Button
                            type='primary'
                            htmlType='submit'
                            className='rounded-md w-full mb-2'
                        >
                            Đăng ký
                        </Button>
                    </Form.Item>
                    <div className='flex justify-center items-center'>
                        <span className='text-sm mr-2'>
                            Bạn đã có tài khoản?
                        </span>
                        <Link href='/login'>Đăng nhập</Link>
                    </div>
                </Form>
            </div>
        </div>
    );
};

export default FormRegister;
