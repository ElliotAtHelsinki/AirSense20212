import React, { useState } from "react";
import UrlBreadcrumb from "../../../../src/components/common/UrlBreadcrumb";
import PageAdminLayout from "../../../../src/components/PageAdminLayout";
import { message, Spin } from "antd";
import FormCustomer from "../../../../src/components/forms/FormCustomer";
import { useForm } from "antd/lib/form/Form";
import { useMutation } from "react-query";
import CustomerModel from "../../../../src/models/Customer";
import { useRouter } from "next/router";
import FileModel from "../../../../src/models/File";
import {dataUrlToFile, formValidatorAfterSubmit} from "../../../../src/utils/validator";
import { APP_USER_TYPE } from "../../../../src/utils/constant";

function Create({ ...props }) {
    const [form] = useForm();
    const router = useRouter();
    const [url, setUrl] = useState();
    const [loading, setLoading] = useState(false);

    const createCustomerBread = [
        {
            name: "Quản lý tài khoản",
        },
        {
            name: "Danh sách khách hàng",
            url: "/admin/manage-account/type-customer",
        },
        {
            name: "Thêm mới khách hàng",
        },
    ];
    const createCustomerMutation = useMutation(
        "createCustomer",
        (body) => CustomerModel.create(body),
        {
            onSuccess: (data) => {
                if (data.status === "ok") {
                    message.success(data.msg);
                    router.push("/admin/manage-account/type-customer");
                }
                setLoading(false);
            },
            onError: (e) => {
                // set error base on server response
                formValidatorAfterSubmit(form , e)
                setLoading(false);
            },
        }
    );

    const uploadMutation = useMutation(
        "uploadImage",
        ({ file }) => FileModel.uploadImage(file),
        {
            onSuccess: async (res, { values }) => {
                setUrl(res.urls);
                createCustomerMutation.mutate({ ...values, avatar: res.urls });
            },
            onError: (e) => {
                // console.log(e);
                // Modal.error({ title: "Thay đổi trạng thái thất bại" });
            },
        }
    );

    const onFinish = ({ password2, ...values }, file) => {
        setLoading(true);
        if (url) {
            createCustomerMutation.mutate({ ...values, avatar: url });
        } else if (file) {
            uploadMutation.mutate({
                file: dataUrlToFile(file, "file.png"),
                values,
            });
        } else {
            createCustomerMutation.mutate(values);
        }
        //
    };

    const onFinishFailed = (errorInfo) => {
        // console.log("Failed:", errorInfo);
    };

    return (
        <section>
            <UrlBreadcrumb breadcrumbs={createCustomerBread} />
            <PageAdminLayout pageName='Thêm mới khách hàng'>
                <Spin spinning={loading}>
                    <FormCustomer
                        userType={APP_USER_TYPE.CUSTOMER}
                        form={form}
                        onFinish={onFinish}
                        onFinishFailed={onFinishFailed}
                        loading={createCustomerMutation.isLoading}
                        isCreate={true}
                    />
                </Spin>
            </PageAdminLayout>
        </section>
    );
}

export default Create;
