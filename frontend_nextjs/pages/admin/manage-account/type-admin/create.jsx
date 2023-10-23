import React, { useState } from "react";
import UrlBreadcrumb from "../../../../src/components/common/UrlBreadcrumb";
import PageAdminLayout from "../../../../src/components/PageAdminLayout";
import { message, Spin } from "antd";
import FormAdmin from "../../../../src/components/forms/FormAdmin";
import { useForm } from "antd/lib/form/Form";
import { useMutation } from "react-query";
import AdminModel from "../../../../src/models/Admin";
import { useRouter } from "next/router";
import FileModel from "../../../../src/models/File";
import {dataUrlToFile, formValidatorAfterSubmit} from "../../../../src/utils/validator";
import FormCustomer from "../../../../src/components/forms/FormCustomer";
import { APP_USER_TYPE } from "../../../../src/utils/constant";

function Create({ ...props }) {
    const [form] = useForm();
    const router = useRouter();
    const [url, setUrl] = useState();
    const [loading, setLoading] = useState(false);

    const createAdminBread = [
        {
            name: "Quản lý tài khoản",
        },
        {
            name: "Danh sách quản trị viên",
            url: "/admin/manage-account/type-admin",
        },
        {
            name: "Thêm mới quản trị viên",
        },
    ];
    const createAdminMutation = useMutation(
        "createAdmin",
        (body) => AdminModel.create(body),
        {
            onSuccess: (data) => {
                if (data.status === "ok") {
                    message.success(data.msg);
                    router.push("/admin/manage-account/type-admin");
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
                createAdminMutation.mutate({ ...values, avatar: res.urls });
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
            createAdminMutation.mutate({ ...values, avatar: url });
        } else if (file) {
            uploadMutation.mutate({
                file: dataUrlToFile(file, "file.png"),
                values,
            });
        } else {
            createAdminMutation.mutate(values);
        }
        //
    };

    const onFinishFailed = (errorInfo) => {
        // console.log("Failed:", errorInfo);
    };

    return (
        <section>
            <UrlBreadcrumb breadcrumbs={createAdminBread} />
            <PageAdminLayout pageName='Thêm mới quản trị viên'>
                <Spin spinning={loading}>
                    <FormCustomer
                        userType={APP_USER_TYPE.ADMIN}
                        form={form}
                        onFinish={onFinish}
                        onFinishFailed={onFinishFailed}
                        loading={createAdminMutation.isLoading}
                        isCreate={true}
                    />
                </Spin>
            </PageAdminLayout>
        </section>
    );
}

export default Create;
