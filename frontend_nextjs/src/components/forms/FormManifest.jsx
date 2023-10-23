import React, { useEffect, useState } from 'react';
import { Button, Form, Input, Select, Tree } from 'antd';
import { useRouter } from 'next/router';
import { useQuery } from 'react-query';
import UserType from '../../models/UserType';
import Permission from '../../models/Permission';

function FormManifest({
    isCreate,
    form,
    onFinish,
    loading,
    defaultCheckPermission,
    ...props
}) {
    const router = useRouter();
    const { data: appUserType, isLoading: loadingAppUserType } = useQuery(
        'getAppUserType',
        async () => {
            const res = await UserType.searchAll();
            return res.rows;
        }
    );
    const { data: appPermissions, isLoading: loadingPermissions } = useQuery(
        'getAllPermission',
        () => Permission.searchAll()
    );
    const [expandedKeyPm, setExpandedKeyPm] = useState([]);

    const [checkedKeyPm, setCheckedKeyPm] = useState(defaultCheckPermission);
    useEffect(() => {
        form.setFields([
            { name: 'permissions', value: defaultCheckPermission },
        ]);
        setCheckedKeyPm(defaultCheckPermission);
    }, [defaultCheckPermission]);
    const onCheck = (checkedKeys, info) => {
        setCheckedKeyPm(checkedKeys);
        form.setFields([{ name: 'permissions', value: checkedKeys }]);
    };
    const onExpand = (expandedKeys, { expanded: bool, node }) => {
        setExpandedKeyPm(expandedKeys);
    };
    return (
        <Form
            form={form}
            onFinish={onFinish}
            layout='vertical'
            scrollToFirstError
        >
            <Form.Item
                label='Tên quyền hạn'
                name='role_name'
                rules={[
                    {
                        required: true,
                        message: 'Tên quyền không được bỏ trống',
                    },
                ]}
            >
                <Input className='rounded-xl' maxLength={50} />
            </Form.Item>
            <Form.Item
                label='Nội dung'
                rules={[
                    {
                        required: true,
                        message: 'Nội dung quyền hạn không được bỏ trống',
                    },
                ]}
                name='content'
            >
                <Input.TextArea
                    className='rounded-xl'
                    size={5}
                    maxLength={255}
                />
            </Form.Item>
            <Form.Item
                label='Trạng thái hoạt động'
                name='is_active'
                initialValue={1}
            >
                <Select>
                    <Select.Option value={0}>Không hoạt động</Select.Option>
                    <Select.Option value={1}>Hoạt động</Select.Option>
                </Select>
            </Form.Item>
            <Form.Item
                label='Áp dụng cho đối tượng người dùng'
                rules={[
                    {
                        required: true,
                        message: 'Đối tượng người dùng không được bỏ trống',
                    },
                ]}
                name='user_type_id'
            >
                <Select
                    loading={loadingAppUserType}
                    options={appUserType?.map((item) => ({
                        value: item.id,
                        label: item.vi_name,
                    }))}
                ></Select>
            </Form.Item>

            <Form.Item label='Chọn phạm vi của chức vụ' name='permissions'>
                <Tree
                    multiple={true}
                    checkable
                    expandedKeys={expandedKeyPm}
                    checkedKeys={checkedKeyPm}
                    onCheck={onCheck}
                    onExpand={onExpand}
                    treeData={appPermissions}
                    fieldNames={{
                        title: 'vi_name',
                        key: 'id',
                        children: 'subPermission',
                    }}
                />
            </Form.Item>
            <Form.Item>
                <div className='flex justify-center gap-4'>
                    <Button type='primary' htmlType='submit' loading={loading}>
                        {isCreate ? 'Tạo' : 'Cập nhật'}
                    </Button>
                    <Button
                        onClick={() => router.push('/admin/manifest')}
                        type='default'
                    >
                        Hủy
                    </Button>
                </div>
            </Form.Item>
        </Form>
    );
}

export default FormManifest;
