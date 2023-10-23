import styled from "styled-components";

export const WrapperContainer = styled.div`
    max-width: calc(100vw - 330px);
    padding: 20px;
    .wrap-header {
        display: flex;
        .ant-breadcrumb {
            margin-bottom: 15px;
            flex: 1;
        }
    }
    .wrap-search {
        display: flex;
        margin-bottom: 10px;
    }
    .wrap-table {
        /* padding: 10px; */
        thead {
            .ant-table-cell {
                background-color: #c4c4c4;
                color: black;
            }
        }
        .ant-table-pagination {
            justify-content: center;
        }
    }
    .wrap-tabs {
        .ant-tabs-tab-btn {
            font-size: 16px;
        }
        .ant-tabs-tab-active {
            border-bottom: 2px solid #2c3d94;
            .ant-tabs-tab-btn {
                color: #2c3d94;
            }
        }
    }

    .ant-spin-text {
        color: red;
        font-weight: bold;
        font-size: 18px;
    }
`;
