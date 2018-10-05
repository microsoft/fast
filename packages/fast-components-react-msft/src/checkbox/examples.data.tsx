import * as React from "react";
import { ComponentFactoryExample } from "@microsoft/fast-development-site-react";
import { Checkbox, CheckboxProps, CheckboxSlot } from "./index";
import schema from "@microsoft/fast-components-react-base/dist/checkbox/checkbox.schema.json";
import Documentation from "./.tmp/documentation";
import { Label } from "../label";

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
            checked: true,
            children: <Label slot={CheckboxSlot.label}>Checked (controlled)</Label>
        },
        {
            disabled: true,
            children: <Label slot={CheckboxSlot.label}>Disabled</Label>
        },
        {
            indeterminate: true,
            children: <Label slot={CheckboxSlot.label}>Indeterminate</Label>
        },
        {
            indeterminate: true,
            checked: true,
            children: <Label slot={CheckboxSlot.label}>Indeterminate checked (controlled)</Label>
        }
    ]
} as ComponentFactoryExample<CheckboxProps>;
