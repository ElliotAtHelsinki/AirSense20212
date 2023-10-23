import React, { useEffect, useState } from 'react';
import { Avatar, Button, Drawer, Dropdown, Menu } from 'antd';
import {
    CompassOutlined,
    HomeOutlined,
    NodeIndexOutlined,
    SettingOutlined,
    TagsOutlined,
    TeamOutlined,
    UnorderedListOutlined,
    UserOutlined,
} from '@ant-design/icons';
import MenuBar from './common/MenuBar';
import useScreenDetect from '../hooks/useScreenDetect';
import useUser from '../hooks/useUser';
import AIRSENSE from '../models/AIRSENSE';
import { FEATURE_PERMISSION } from '../utils/constant';
import { useQuery } from 'react-query';
import User from '../models/User';
import { useRouter } from 'next/router';
import Link from 'next/link';

export default function AdminLayout({ children }) {
    let { permissions, clearUser, user } = useUser();
    const router = useRouter();
    const menuList = (permissions) => [
        {
            id: '/admin',
            title: 'Trang chủ',
            icon: <HomeOutlined />,
            isHide: false,
        },
        {
            id: '/admin/manage-account',
            title: 'Quản lý tài khoản',
            icon: <UserOutlined />,
            isHide: false,
            children: [
                {
                    id: '/admin/manage-account/type-customer',
                    title: 'Khách hàng',
                    isHide: !AIRSENSE.canAccessFuture(
                        FEATURE_PERMISSION.SEARCH_CUSTOMER,
                        permissions
                    ),
                    url: '/admin/manage-account/type-customer',
                },
                {
                    id: '/admin/manage-account/type-adminLocation',
                    title: 'Quản trị viên trạm',
                    isHide: !AIRSENSE.canAccessFuture(
                        FEATURE_PERMISSION.SEARCH_ADMIN_LOCATION,
                        permissions
                    ),
                    url: '/admin/manage-account/type-adminLocation',
                },
                {
                    id: '/admin/manage-account/type-admin',
                    title: 'Quản trị viên hệ thống',
                    url: '/admin/manage-account/type-admin',
                    isHide: !AIRSENSE.canAccessFuture(
                        FEATURE_PERMISSION.SEARCH_ADMIN,
                        permissions
                    ),
                },
                {
                    id: '/admin/manage-account/profile',
                    title: 'Thông tin tài khoản',
                    url: '/admin/manage-account/profile',
                    isHide: false,
                },
            ],
        },
        {
            id: '/admin/manifest',
            title: 'Quản lý chức vụ',
            icon: <TeamOutlined />,
            isHide: !AIRSENSE.canAccessFuture(
                FEATURE_PERMISSION.SEARCH_MANIFEST,
                permissions
            ),
            children: [
                {
                    id: '/admin/manifest',
                    title: 'Danh sách chức vụ',
                    url: '/admin/manifest',
                    isHide: !AIRSENSE.canAccessFuture(
                        FEATURE_PERMISSION.SEARCH_MANIFEST,
                        permissions
                    ),
                },
                {
                    id: '/admin/manifest/create',
                    title: 'Tạo mới chức vụ',
                    url: '/admin/manifest/create',
                    isHide: !AIRSENSE.canAccessFuture(
                        FEATURE_PERMISSION.CREATE_MANIFEST,
                        permissions
                    ),
                },
            ],
        },
        {
            id: '/admin/sensors',
            title: 'Quản lý thiết bị',
            icon: <NodeIndexOutlined />,
            isHide: !AIRSENSE.canAccessFuture(
                FEATURE_PERMISSION.MANAGE_SENSOR_DEVICE,
                permissions
            ),
            children: [
                {
                    id: '/admin/sensors',
                    title: 'Danh sách ',
                    url: '/admin/sensors',
                    isHide: !AIRSENSE.canAccessFuture(
                        FEATURE_PERMISSION.SEARCH_SENSOR_DEVICE,
                        permissions
                    ),
                },
                {
                    id: '/admin/sensors/create',
                    title: 'Tạo mới thiết bị',
                    url: '/admin/sensors/create',
                    isHide: !AIRSENSE.canAccessFuture(
                        FEATURE_PERMISSION.CREATE_SENSOR_DEVICE,
                        permissions
                    ),
                },
            ],
        },
        {
            id: '/admin/sensor-type',
            title: 'Quản lý loại thiết bị ',
            icon: <TagsOutlined />,
            isHide: !AIRSENSE.canAccessFuture(
                FEATURE_PERMISSION.MANAGE_SENSOR_TYPE,
                permissions
            ),
            children: [
                {
                    id: '/admin/sensor-type',
                    title: 'Danh sách ',
                    url: '/admin/sensor-type',
                    isHide: !AIRSENSE.canAccessFuture(
                        FEATURE_PERMISSION.SEARCH_SENSOR_TYPE,
                        permissions
                    ),
                },
                {
                    id: '/admin/sensor-type/create',
                    title: 'Tạo mới loại thiết bị ',
                    url: '/admin/sensor-type/create',
                    isHide: !AIRSENSE.canAccessFuture(
                        FEATURE_PERMISSION.CREATE_SENSOR_TYPE,
                        permissions
                    ),
                },
            ],
        },
        {
            id: '/admin/location',
            title: 'Quản lý trạm ',
            icon: <CompassOutlined />,
            isHide: !AIRSENSE.canAccessFuture(
                FEATURE_PERMISSION.MANAGE_LOCATION,
                permissions
            ),
            children: [
                {
                    id: '/admin/location',
                    title: 'Danh sách ',
                    url: '/admin/location',
                    isHide: !AIRSENSE.canAccessFuture(
                        FEATURE_PERMISSION.SEARCH_LOCATION,
                        permissions
                    ),
                },
                {
                    id: '/admin/location/create',
                    title: 'Tạo mới trạm',
                    url: '/admin/location/create',
                    isHide: !AIRSENSE.canAccessFuture(
                        FEATURE_PERMISSION.CREATE_LOCATION,
                        permissions
                    ),
                },
            ],
        },
        //
        // {
        //     id: 6,
        //     title: 'Theo dõi sự cố',
        //     icon: <SettingOutlined />,
        //     isHide: false,
        // },
    ];
    const menu = menuList(permissions || []);

    const [isShowDrawer, setShowDrawer] = useState(false);
    const [isHaveUser, setHaveUser] = useState(false);
    const { isTablet, isMobile } = useScreenDetect();
    useEffect(() => {
        if (!isMobile && !isTablet) {
            setShowDrawer(false);
        }
    }, [isMobile, isTablet]);

    useQuery('getInfo', () => User.getInfo(), {
        enabled: typeof window !== 'undefined',
        onSuccess: () => {
            setHaveUser(true);
        },
        onError: (e) => {
            router.push({
                pathname: '/dashboard-login',
                backUrl: router.pathname,
            });
            setHaveUser(false);
        },
    });

    if (!isHaveUser) return null;
    return (
        <section>
            <Drawer
                title='Menu'
                placement='top'
                height='100vh'
                onClose={() => setShowDrawer(false)}
                visible={isShowDrawer}
                bodyStyle={{ padding: 0 }}
            >
                <MenuBar
                    className='w-full min-h-max overflow-auto overflow-x-hidden beauty-scroll text-base'
                    mode='inline'
                    menuList={menu}
                />
            </Drawer>
            <div
                className='flex justify-between px-4 items-center w-full bg-white
                            h-20 tablet:h-16 mobile:h-14
                            shadow-xl fixed z-max top-0'
            >
                <Link href='/admin/' scroll={true}>
                    <img src='/logo.jpg' />
                </Link>
                <div className='flex tablet:gap-4 mobile:gap-3'>
                    <Dropdown
                        trigger='click'
                        overlay={
                            <Menu mode='vertical'>
                                <Menu.Item
                                    key='1'
                                    onClick={() => {
                                        router.push(
                                            '/admin/manage-account/profile'
                                        );
                                    }}
                                >
                                    Thông tin tài khoản
                                </Menu.Item>
                                <Menu.Item key='2'>Đổi mật khẩu</Menu.Item>
                                <Menu.Item
                                    key='3'
                                    onClick={() => {
                                        clearUser();
                                        router.push('/dashboard-login');
                                    }}
                                >
                                    Đăng xuất
                                </Menu.Item>
                            </Menu>
                        }
                    >
                        <Avatar>S</Avatar>
                    </Dropdown>
                    <Button
                        type='text'
                        className='hidden tablet:block px-2'
                        onClick={() => setShowDrawer(true)}
                    >
                        <UnorderedListOutlined className='text-xl flex items-center font-bold' />
                    </Button>
                </div>
            </div>
            <div className='flex'>
                <div className='h-screen pt-22 w-64 fixed left-0 top-0 tablet:hidden'>
                    <MenuBar
                        className='h-full overflow-auto overflow-x-hidden beauty-scroll text-base'
                        mode='inline'
                        menuList={menu}
                    />
                </div>
                <div className='bg-main w-full min-h-screen p-6 tablet:p-4 ml-64 tablet:ml-0 mt-20'>
                    {children}
                </div>
            </div>
        </section>
    );
}
