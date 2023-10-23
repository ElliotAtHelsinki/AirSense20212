import { message, Spin } from "antd";
import { useForm } from "antd/lib/form/Form";
import moment from "moment";
import { useRouter } from "next/router";
import { useState } from "react";
import { useMutation, useQuery } from "react-query";
import UrlBreadcrumb from "../../../../../src/components/common/UrlBreadcrumb";
import PageAdminLayout from "../../../../../src/components/PageAdminLayout";
import AdminModel from "../../../../../src/models/AdminLocation";
import FileModel from "../../../../../src/models/File";
import {dataUrlToFile, formValidatorAfterSubmit} from "../../../../../src/utils/validator";
import FormCustomer from "../../../../../src/components/forms/FormCustomer";
import { APP_USER_TYPE } from "../../../../../src/utils/constant";

function AdminDetail({ ...props }) {
    const router = useRouter();
    const { id } = router.query;
    const [form] = useForm();
    const [loading, setLoading] = useState(true);
    const [avatar, setAvatar] = useState();
    const [url, setUrl] = useState();

    const { isLoading, refetch } = useQuery(
        "getDetailAdmin",
        () => AdminModel.detail(id),
        {
            enabled: !!id,
            onSuccess: (data) => {
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
        }
    );
    const updateAdminMutation = useMutation(
        "updateAdmin",
        (body) => AdminModel.update(id, body),
        {
            onSuccess: (data) => {
                if (data.status === "ok") {
                    message.success(data.msg);
                    router.push("/admin/manage-account/type-adminLocation");
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

    const updateAdminBread = [
        {
            name: "Quản lý tài khoản",
        },
        {
            name: "Danh sách quản trị viên trạm",
            url: "/admin/manage-account/type-adminLocation",
        },
        {
            name: "Cập nhật quản trị viên trạm",
        },
    ];

    const uploadMutation = useMutation(
        "uploadImage",
        ({ file }) => FileModel.uploadImage(file),
        {
            onSuccess: async (res, { values }) => {
                setUrl(res.urls);
                updateAdminMutation.mutate({ ...values, avatar: res.urls });
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
            updateAdminMutation.mutate({ ...values, avatar: url });
        } else if (file) {
            uploadMutation.mutate({
                file: dataUrlToFile(file, "file.png"),
                values,
            });
        } else {
            updateAdminMutation.mutate(values);
        }
        //
    };

    const onFinishFailed = (errorInfo) => {
        // console.log("Failed:", errorInfo);
    };

    const UpdateAvatarMutation = useMutation(
        "updateAvatar",
        (body) => AdminModel.apiPut("/update-avatar/" + id, body),
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
            <UrlBreadcrumb breadcrumbs={updateAdminBread} />
            <PageAdminLayout pageName='Cập nhật quản trị viên trạm'>
                <Spin spinning={isLoading || loading}>
                    <FormCustomer
                        userType={APP_USER_TYPE.ADMIN_LOCATION}
                        form={form}
                        onFinish={onFinish}
                        onFinishFailed={onFinishFailed}
                        loading={updateAdminMutation.isLoading}
                        apiUpdateAvatar={({ file }) => {
                            const formData = new FormData();
                            formData.append("file", file);

                            setLoading(true);
                            UpdateAvatarMutation.mutate(formData);
                        }}
                        avatar={avatar}
                    />
                </Spin>
            </PageAdminLayout>
        </section>
    );
}

export default AdminDetail;
