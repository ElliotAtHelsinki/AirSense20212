import { message, Spin } from "antd";
import { useForm } from "antd/lib/form/Form";
import { useRouter } from "next/router";
import { useState } from "react";
import { useMutation, useQuery } from "react-query";
import UrlBreadcrumb from "../../../../../src/components/common/UrlBreadcrumb";
import FormCustomer from "../../../../../src/components/forms/FormCustomer";
import PageAdminLayout from "../../../../../src/components/PageAdminLayout";
import CustomerModel from "../../../../../src/models/Customer";
import FileModel from "../../../../../src/models/File";
import { dataUrlToFile, formValidatorAfterSubmit } from "../../../../../src/utils/validator";
import moment from "moment";
import { APP_USER_TYPE } from "../../../../../src/utils/constant";

function CustomerDetail({ ...props }) {
    const router = useRouter();
    const { id } = router.query;
    const [form] = useForm();
    const [loading, setLoading] = useState(true);
    const [avatar, setAvatar] = useState();
    const [url, setUrl] = useState();

    const { isLoading, refetch } = useQuery(
        "getDetailCustomer",
        () => CustomerModel.detail(id),
        {
            enabled: !!id,
            onSuccess: (data) => {
                // trải phẳng data
                setAvatar(data.avatar);
                form.setFieldsValue({
                    ...data,
                    manifests: data.Manifests.map(item => item.id),
                    date_of_birth: data.date_of_birth
                        ? moment(data.date_of_birth)
                        : null,
                });
                setLoading(false);
            },
        },
    );
    const updateCustomerMutation = useMutation(
        "updateCustomer",
        (body) => CustomerModel.update(id, body),
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
                formValidatorAfterSubmit(form, e);
                setLoading(false);
            },
        },
    );

    const updateCustomerBread = [
        {
            name: "Quản lý tài khoản",
        },
        {
            name: "Danh sách khách hàng",
            url: "/admin/manage-account/type-customer",
        },
        {
            name: "Cập nhật khách hàng",
        },
    ];

    const uploadMutation = useMutation(
        "uploadImage",
        ({ file }) => FileModel.uploadImage(file),
        {
            onSuccess: async (res, { values }) => {
                setUrl(res.urls);
                updateCustomerMutation.mutate({ ...values, avatar: res.urls });
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
            updateCustomerMutation.mutate({ ...values, avatar: url });
        } else if (file) {
            uploadMutation.mutate({
                file: dataUrlToFile(file, "file.png"),
                values,
            });
        } else {
            updateCustomerMutation.mutate(values);
        }
        //
    };

    const onFinishFailed = (errorInfo) => {
        // console.log("Failed:", errorInfo);
    };

    const UpdateAvatarMutation = useMutation(
        "updateAvatar",
        (body) => CustomerModel.apiPut("/update-avatar/" + id, body),
        {
            onSuccess: async (data) => {
                refetch();
                setLoading(false);
                message.success(data.message || "Cập nhật thành công");
            },
            onError: (e) => {
                // console.log(e);
            },
        }
    );
    return (
        <section>
            <UrlBreadcrumb breadcrumbs={updateCustomerBread} />
            <PageAdminLayout pageName='Cập nhật khách hàng'>
                <Spin spinning={isLoading || loading}>
                    <FormCustomer
                        userType={APP_USER_TYPE.CUSTOMER}
                        form={form}
                        onFinish={onFinish}
                        onFinishFailed={onFinishFailed}
                        loading={updateCustomerMutation.isLoading}
                        apiUpdateAvatar={({ file }) => {
                            const formData = new FormData();
                            formData.append("file", file);

                            setLoading(true);
                            UpdateAvatarMutation.mutate(formData);
                        }}
                        isCreate={false}
                        avatar={avatar}
                    />
                </Spin>
            </PageAdminLayout>
        </section>
    );
}

export default CustomerDetail;
