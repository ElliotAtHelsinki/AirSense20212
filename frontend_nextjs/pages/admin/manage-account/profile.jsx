/* eslint-disable @next/next/no-img-element */
import React, { useState } from "react";
import styled from "styled-components";
import { Tabs } from "antd";
import useUser from "../../../src/hooks/useUser";
import FormChangeProfile from "../../../src/components/Profile/FormChangeProfile";
import FormChangePassword from "../../../src/components/Profile/FormChangePassword";
import UrlBreadcrumb from "../../../src/components/common/UrlBreadcrumb";

const ProfilePageWrapper = styled.div`
    .ant-tabs-content {
        justify-content: center;
    }
`;
const { TabPane } = Tabs;
const detailAccountBread = [
    {
        name: 'Quản lý tài khoản',
    },
    {
        name: 'Thông tin tài khoản',
        url: '',
    },
];

function Profile({ breadcrumbs = detailAccountBread, ...props }) {
    const { user } = useUser();
    const [loadingBt, setLoadingBt] = useState(false);
    return (
        <ProfilePageWrapper>
            <div className='px-7 py-4'>
                <UrlBreadcrumb breadcrumbs={breadcrumbs} />
                <div className='profile_content'>
                    <Tabs defaultActiveKey='1'>
                        <TabPane tab='Chinh sửa thông tin tài khoản' key='1'>
                            <FormChangeProfile
                                user={user}
                                loadingBt={loadingBt}
                                setLoadingBt={setLoadingBt}
                                // notification={notification}
                            />
                        </TabPane>
                        <TabPane
                            tab='Đổi mật khẩu'
                            key='2'
                            className='mobile:w-full w-3/5 mt-20'
                        >
                            <FormChangePassword
                                loadingBt={loadingBt}
                                setLoadingBt={setLoadingBt}
                            />
                        </TabPane>
                    </Tabs>
                </div>
            </div>
        </ProfilePageWrapper>
    );
}

export default Profile;
