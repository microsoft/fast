import React from "react";
import { ComponentFactoryExample } from "@microsoft/fast-development-site-react";
import { Checkbox, CheckboxProps, checkboxSchema, CheckboxSlot } from "./index";
import { Label, labelSchema } from "../index";
import Documentation from "./.tmp/documentation";

export default {
    name: "Checkbox",
    component: Checkbox,
    schema: checkboxSchema as any,
    documentation: <Documentation />,
    detailData: {
        inputId: "checkbox",
        children: {
            id: labelSchema.id,
            props: {
                slot: CheckboxSlot.label,
                htmlFor: "checkbox",
                children: "Checkbox",
            },
        },
    },
    data: [
        {
            inputId: "checkbox1",
            children: {
                id: labelSchema.id,
                props: {
                    slot: CheckboxSlot.label,
                    htmlFor: "checkbox1",
                    children: "Default",
                },
            },
        },
        {
            inputId: "checkbox2",
            checked: true,
            children: {
                id: labelSchema.id,
                props: {
                    slot: CheckboxSlot.label,
                    htmlFor: "checkbox2",
                    children: "Checked (controlled)",
                },
            },
        },
        {
            inputId: "checkbox3",
            disabled: true,
            children: {
                id: labelSchema.id,
                props: {
                    slot: CheckboxSlot.label,
                    htmlFor: "checkbox3",
                    children: "Disabled",
                },
            },
        },
        {
            inputId: "checkbox4",
            indeterminate: true,
            children: {
                id: labelSchema.id,
                props: {
                    slot: CheckboxSlot.label,
                    htmlFor: "checkbox4",
                    children: "Indeterminate",
                },
            },
        },
        {
            inputId: "checkbox5",
            indeterminate: true,
            checked: true,
            children: {
                id: labelSchema.id,
                props: {
                    slot: CheckboxSlot.label,
                    htmlFor: "checkbox5",
                    children: "Indeterminate checked (controlled)",
                },
            },
        },
    ],
} as ComponentFactoryExample<CheckboxProps>;
