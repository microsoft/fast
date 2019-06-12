import React from "react";
import { ComponentFactoryExample } from "@microsoft/fast-development-site-react";
import { Dialog, DialogProps, dialogSchema } from "./index";
import Documentation from "./.tmp/documentation";

export default {
    name: "Dialog",
    component: Dialog,
    schema: dialogSchema as any,
    documentation: <Documentation />,
    detailData: {
        contentHeight: "300px",
        contentWidth: "500px",
        modal: true,
    },
    data: [
        {
            contentHeight: "300px",
            contentWidth: "500px",
        },
        {
            contentHeight: "350px",
            contentWidth: "500px",
            modal: true,
        },
    ],
} as ComponentFactoryExample<DialogProps>;
