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
        inputId: "checkbox",
        children: {
            id: "label",
            props: {
                slot: CheckboxSlot.label,
                children: "Checkbox",
            },
        },
    },
    data: [
        {
            inputId: "checkbox1",
            children: {
                id: "label",
                props: {
                    slot: CheckboxSlot.label,
                    children: "Default",
                },
            },
        },
        {
            inputId: "checkbox2",
            checked: true,
            children: {
                id: "label",
                props: {
                    slot: CheckboxSlot.label,
                    children: "Checked (controlled)",
                },
            },
        },
        {
            inputId: "checkbox3",
            disabled: true,
            children: {
                id: "label",
                props: {
                    slot: CheckboxSlot.label,
                    children: "Disabled",
                },
            },
        },
        {
            inputId: "checkbox4",
            indeterminate: true,
            children: {
                id: "label",
                props: {
                    slot: CheckboxSlot.label,
                    children: "Indeterminate",
                },
            },
        },
        {
            inputId: "checkbox5",
            indeterminate: true,
            checked: true,
            children: {
                id: "label",
                props: {
                    slot: CheckboxSlot.label,
                    children: "Indeterminate checked (controlled)",
                },
            },
        },
    ],
} as ComponentFactoryExample<CheckboxProps>;
