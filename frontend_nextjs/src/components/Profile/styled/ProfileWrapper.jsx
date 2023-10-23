import styled from 'styled-components';

export const ProfileWrapper = styled.div`
    .profile_left {
        .avatar {
            display: flex;
            align-items: center;
            justify-content: center;
            .anticon-user {
                display: flex;
                align-items: center;
                justify-content: center;
                width: 50%;
                height: 50%;
                svg {
                    width: 100%;
                    height: 100%;
                }
            }
        }
    }
    .ant-picker {
        border-radius: 12px;
    }
    .ant-input-password {
        border-radius: 12px !important;
        .ant-input {
            border-radius: 0px !important;
        }
    }

    .ant-form-item-control-input-content {
        display: flex;
        justify-content: center;
        .ant-btn-loading-icon {
            .anticon-loading {
                margin-top: 4px;
                display: flex;
                align-items: center;
            }
        }
    }
    .date {
        .ant-form-item-control-input-content {
            justify-content: start;
        }
    }
    s .ant-tabs-tab {
        &.ant-tabs-tab-active {
            position: relative;
            &:after {
                content: '';
                width: 100%;
                height: 1px;
                background-color: #4976aa;
                position: absolute;
                bottom: 0;
                left: 0;
            }
        }
    }
`;
