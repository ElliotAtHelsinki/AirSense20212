import { SaveOutlined } from "@ant-design/icons";
import { Button, Form, Input, message } from "antd";
import React from "react";
import { StyledAccount } from "../../styles/styledComponent/account";

const ChangePassword = (props) => {
    const onFinish = ({ oldPass, password, password2 }) => {
        if (password != password2) {
            message.error("Mật khẩu không đúng vui lòng kiểm tra lại");
        } else {
            message.success("Tính năng chưa hoàn thiện");
        }
    };

    return (
        <StyledAccount>
            <div className='wrapper-form'>
                <Form
                    name='changePassForm'
                    onFinish={onFinish}
                    // onFinishFailed={onFinishFailed}
                >
                    <Form.Item
                        label='Mật khẩu cũ'
                        name='oldPass'
                        rules={[
                            {
                                required: true,
                                message: "Mật khẩu cũ không được bỏ trống",
                            },
                        ]}
                    >
                        <Input className='rounded-xl' />
                    </Form.Item>

                    <Form.Item
                        label='Mật khẩu mới'
                        name='password'
                        rules={[
                            {
                                required: true,
                                message: "Mật khẩu không được bỏ trống",
                            },
                        ]}
                    >
                        <Input.Password className='rounded-xl' />
                    </Form.Item>
                    <Form.Item
                        label='Xác nhận mật khẩu mới'
                        name='password2'
                        rules={[
                            {
                                required: true,
                                message: "Mật khẩu không được bỏ trống",
                            },
                        ]}
                    >
                        <Input.Password className='rounded-xl' />
                    </Form.Item>

                    <Form.Item className='button-submit'>
                        <Button
                            type='primary'
                            htmlType='submit'
                            className='rounded-md mb-2'
                            icon={<SaveOutlined />}
                        >
                            <span>Đổi mật khẩu mới</span>
                        </Button>
                    </Form.Item>
                </Form>
            </div>
        </StyledAccount>
    );
};

export default ChangePassword;
