import React from "react";
import { ComponentFactoryExample } from "@microsoft/fast-development-site-react";
import { Label, LabelProps, labelSchema, LabelTag } from "./index";
import Documentation from "./.tmp/documentation";

export default {
    name: "Label",
    component: Label,
    schema: labelSchema as any,
    documentation: <Documentation />,
    detailData: {
        tag: LabelTag.label,
        children: "Label",
    },
    data: [
        {
            tag: LabelTag.label,
            children: "Label",
            "data-sketch-symbol": "Label",
        },
        {
            tag: LabelTag.legend,
            children: "Legend label",
        },
        {
            hidden: true,
            tag: LabelTag.label,
            children: "Hidden label",
        },
    ],
} as ComponentFactoryExample<LabelProps>;
