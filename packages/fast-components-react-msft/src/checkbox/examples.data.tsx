import * as React from "react";
import { IComponentFactoryExample } from "@microsoft/fast-development-site-react";
import { Checkbox } from "./index";
import { ICheckboxHandledProps } from "@microsoft/fast-components-react-base";
import schema from "@microsoft/fast-components-react-base/dist/checkbox/checkbox.schema.json";
import Documentation from "./.tmp/documentation";

export default {
    name: "Checkbox",
    component: Checkbox,
    schema: schema as any,
    documentation: <Documentation />,
    detailData: {
        text: "Checkbox"
    },
    data: [
        {
            children: "Default"
        },
        {
            tag: "div",
            children: "div tag"
        },
        {
            checked: true,
            children: "Checked (controlled)"
        },
        {
            disabled: true,
            children: "Disabled"
        },
        {
            indeterminate: true,
            children: "Indeterminate"
        },
        {
            indeterminate: true,
            checked: true,
            children: "Indeterminate checked (controlled)"
        }
    ]
} as IComponentFactoryExample<ICheckboxHandledProps>;
