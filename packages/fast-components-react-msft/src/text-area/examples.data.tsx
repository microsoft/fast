import React from "react";
import { ComponentFactoryExample } from "@microsoft/fast-development-site-react";
import { TextArea, TextAreaProps, textAreaSchema } from "./index";
import Documentation from "./.tmp/documentation";

export default {
    name: "Text area",
    component: TextArea,
    schema: textAreaSchema as any,
    documentation: <Documentation />,
    detailData: {
        placeholder: "Text area placeholder text",
    },
    data: [
        {
            placeholder: "Text area placeholder text",
        },
        {
            disabled: true,
            placeholder: "Disabled text area text",
        },
    ],
} as ComponentFactoryExample<TextAreaProps>;
