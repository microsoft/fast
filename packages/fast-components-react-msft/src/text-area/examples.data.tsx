import * as React from "react";
import { ComponentFactoryExample } from "@microsoft/fast-development-site-react";
import { TextArea, TextAreaProps } from "./index";
import schema from "@microsoft/fast-components-react-base/dist/text-area/text-area.schema.json";
import Documentation from "./.tmp/documentation";

export default {
    name: "Text area",
    component: TextArea,
    schema: schema as any,
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
