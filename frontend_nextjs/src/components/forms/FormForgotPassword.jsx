import React from 'react';
import { useMutation } from 'react-query';
import { Button, Form, Input, Modal } from 'antd';
import user from '../../models/User';
import { useForm } from 'antd/lib/form/Form';
import { validateEmail } from '../../utils/validator';

const FormForgotPassword = ({ bgImage, routePass, ...props }) => {
    const styling = {
        backgroundImage: `url(${bgImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
    };
    const [resetPwForm] = useForm();
    const success = () => {
        Modal.success({
            content: "Vui lòng check email!!",
            centered: true,
        });
    };
    const error = () => {
        Modal.error({
            content: "Email không tồn tại!",
            centered: true,
        });
    };
    const resetPasswordMutation = useMutation(
        "resetPassword",
        (body) => user.forgotPassword(body),
        {
            onSuccess: () => {
                success();
            },
            onError: () => {
                error();
            },
        }
    );
    const onFinish = () => {
        resetPwForm.validateFields().then((values) => {
            resetPasswordMutation.mutate(values);
        });
    };
    return (
        <div className='h-screen w-screen flex items-center' style={styling}>
            <div className='container mx-auto w-1/3 tablet:w-11/12 bg-white px-6 py-12 rounded-xl drop-shadow-xl'>
                <h1 className='text-3xl font-bold text-primary mb-8 text-center'>
                    Thay đổi mật khẩu
                </h1>
                <Form
                    name='loginForm'
                    layout='vertical'
                    onFinish={onFinish}
                    form={resetPwForm}
                >
                    <Form.Item
                        label='Vui lòng nhập Email bạn dùng để đăng nhập'
                        name='email'
                        rules={[
                            validateEmail("Email không đúng định dạng!"),
                            {
                                required: true,
                                message: "Email không được bỏ trống!",
                            },
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
                            Xác nhận
                        </Button>
                    </Form.Item>
                </Form>
            </div>
        </div>
    );
};
export default FormForgotPassword;
