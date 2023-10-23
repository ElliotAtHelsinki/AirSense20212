import React from "react";
import FormLogin from "../src/components/forms/FormLogin";
import { useRouter } from "next/router";

function DashboardLogin({ ...props }) {
    const router= useRouter()

    return <FormLogin routePass={router.query.backUrl || "/admin"} bgImage={"/bg1.jpg"} />;
}

export default DashboardLogin;
