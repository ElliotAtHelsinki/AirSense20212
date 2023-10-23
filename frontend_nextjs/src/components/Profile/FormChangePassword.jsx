import { Button, Form, Input, notification, Spin } from 'antd';
import React, { useState } from 'react';
import { useMutation } from 'react-query';
import { validatePassword } from '../../utils/validator';
import getUserProfile from '../../models/User';
import { useForm } from 'antd/lib/form/Form';
import { ProfileWrapper } from './styled/ProfileWrapper';

const FormChangePassword = ({ loadingBt, setLoadingBt }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [formChangePass] = useForm();
    const changePw = useMutation(
        "changePw",
        (body) => getUserProfile.changePassword(body),
        {
            onSuccess: (data) => {
                notification.success({
                    message: "Cập nhật mật khẩu thành công!",
                });
                setIsLoading(false);
            },
            onError: (err) => {
                // console.log(err);
                notification.error({
                    message: err.msg,
                });
                setIsLoading(false);
            },
        }
    );
    const onChangePw = () => {
        setIsLoading(true);
        formChangePass.validateFields().then((values) => {
            let dataPw = {
                oldPassword: values.oldPassword,
                newPassword: values.newPassword,
            };
            // console.log(dataPw);
            changePw.mutate(values);
        });
    };
    return (
        <ProfileWrapper>
            <Spin spinning={isLoading}>
                <Form
                    form={formChangePass}
                    name='passwordChange'
                    labelCol={{ span: 8 }}
                    wrapperCol={{ span: 16 }}
                    onFinish={onChangePw}
                    autoComplete='off'
                >
                    <Form.Item
                        label='Mật khẩu hiện tại'
                        name='oldPassword'
                        rules={[
                            {
                                required: true,
                                message: "Mật khẩu không được bỏ trống!",
                            },
                        ]}
                    >
                        <Input.Password className='rounded-lg' />
                    </Form.Item>

                    <Form.Item
                        label='Mật khẩu mới'
                        name='newPassword'
                        dependencies={["oldPassword"]}
                        rules={[
                            validatePassword("Mật khẩu không đúng định dạng"),
                            {
                                required: true,
                                message: "Mật khẩu mới không được bỏ trống!",
                            },
                            ({ getFieldValue }) => ({
                                validator(_, value) {
                                    if (
                                        !value ||
                                        getFieldValue("oldPassword") !== value
                                    ) {
                                        return Promise.resolve();
                                    }
                                    return Promise.reject(
                                        new Error(
                                            "Mật khẩu không được giống mật khẩu cũ"
                                        )
                                    );
                                },
                            }),
                        ]}
                    >
                        <Input.Password className='rounded-lg' />
                    </Form.Item>
                    <Form.Item
                        label='Xác nhận Mật khẩu mới'
                        name='cfNewPassword'
                        dependencies={["newPassword"]}
                        rules={[
                            {
                                required: true,
                                message: "Hãy nhập lại mật khẩu mới!",
                            },
                            ({ getFieldValue }) => ({
                                validator(_, value) {
                                    if (
                                        !value ||
                                        getFieldValue("newPassword") === value
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
                        <Input.Password className='rounded-lg' />
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
            </Spin>
        </ProfileWrapper>
    );
};

export default FormChangePassword;
