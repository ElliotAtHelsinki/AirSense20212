import { SaveOutlined } from "@ant-design/icons";
import { Button, DatePicker, Form, Input, message, Select } from "antd";
import React from "react";
import { StyledAccount } from "../../styles/styledComponent/account";

const InfoAccount = (props) => {
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
                <div className='avatar'>
                    <img src='/avtdefault.jpg' />
                </div>

                <Form
                    name='infoAccountForm'
                    onFinish={onFinish}
                    // onFinishFailed={onFinishFailed}
                >
                    <Form.Item
                        label='Họ'
                        name='ho'
                        rules={[
                            {
                                required: true,
                                message: "Vui lòng nhập họ",
                            },
                        ]}
                    >
                        <Input className='rounded-xl' placeholder='Admin' />
                    </Form.Item>

                    <Form.Item
                        label='Tên'
                        name='ten'
                        rules={[
                            {
                                required: true,
                                message: "Vui lòng nhập tên",
                            },
                        ]}
                    >
                        <Input className='rounded-xl' placeholder='Admin' />
                    </Form.Item>
                    <Form.Item
                        label='Email'
                        name='email'
                        rules={[
                            {
                                required: true,
                                message: "Vui lòng nhập email",
                            },
                        ]}
                    >
                        <Input
                            className='rounded-xl'
                            placeholder='admin@gmail.com'
                        />
                    </Form.Item>
                    <Form.Item
                        label='Ngày sinh'
                        name='ngaySinh'
                        rules={[
                            {
                                required: true,
                                message: "Vui lòng nhập ngày sinh",
                            },
                        ]}
                    >
                        <DatePicker
                            className='rounded-xl'
                            format={"DD/MM/YYYY"}
                            placeholder='Chọn ngày tháng năm sinh'
                        />
                    </Form.Item>
                    <Form.Item
                        label='Giới tính'
                        name='gioiTinh'
                        rules={[
                            {
                                required: true,
                                message: "Vui lòng chọn giới tính",
                            },
                        ]}
                    >
                        <Select
                            className='rounded-xl'
                            placeholder='Chọn giới tính'
                            options={[
                                { value: 1, label: "Nam" },
                                { value: 2, label: "Nữ" },
                            ]}
                        />
                    </Form.Item>

                    <Form.Item className='button-submit'>
                        <Button
                            type='primary'
                            htmlType='submit'
                            className='rounded-md mb-2 w-130'
                            icon={<SaveOutlined />}
                        >
                            <span>Cập nhật</span>
                        </Button>
                    </Form.Item>
                </Form>
            </div>
        </StyledAccount>
    );
};

export default InfoAccount;
