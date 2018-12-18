import React from "react";
import { ComponentFactoryExample } from "@microsoft/fast-development-site-react";
import { Dialog, DialogProps } from "./index";
import schema from "@microsoft/fast-components-react-base/dist/dialog/dialog.schema.json";
import Documentation from "./.tmp/documentation";

export default {
    name: "Dialog",
    component: Dialog,
    schema: schema as any,
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
