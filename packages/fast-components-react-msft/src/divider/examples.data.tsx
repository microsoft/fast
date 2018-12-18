import React from "react";
import { ComponentFactoryExample } from "@microsoft/fast-development-site-react";
import { Divider, DividerProps, DividerRoles } from "./index";
import schema from "@microsoft/fast-components-react-base/dist/divider/divider.schema.json";
import Documentation from "./.tmp/documentation";

export default {
    name: "Divider",
    component: Divider,
    schema: schema as any,
    documentation: <Documentation />,
    detailData: {
        role: void 0,
    },
    data: [
        {
            role: void 0,
            "data-sketch-symbol": "Divider",
        },
        {
            role: DividerRoles.presentation,
        },
        {
            role: DividerRoles.separator,
        },
    ],
} as ComponentFactoryExample<DividerProps>;
