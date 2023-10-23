import styled from "styled-components";

export const StyledAccount = styled.div`
    display: flex;
    justify-content: center;
    .wrapper-form {
        #changePassForm {
            width: 500px;
            .ant-form-item-label {
                width: 200px;
            }
            .button-submit {
                .ant-form-item-control-input-content {
                    display: flex;
                    button {
                        margin-left: auto;
                        width: 200px;
                        display: flex;

                        svg {
                            margin-top: 2px;
                            font-size: 18px;
                        }
                    }
                }
            }
        }
        .avatar {
            display: flex;
            margin-bottom: 20px;
            img {
                margin: 0 auto;
            }
        }
        #infoAccountForm {
            width: 500px;
            .ant-form-item-label {
                width: 100px;
            }
            .ant-picker {
                width: 100%;
            }
            .button-submit {
                .ant-form-item-control-input-content {
                    display: flex;
                    button {
                        margin-left: auto;
                        width: 130px;
                        display: flex;

                        svg {
                            margin-top: 2px;
                            font-size: 18px;
                        }
                    }
                }
            }
        }
    }
`;
