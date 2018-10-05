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
        children: {
            id: "label",
            props: {
                slot: CheckboxSlot.label,
                children: "Checkbox"
            }
        }
    },
    data: [
        {
            children: {
                id: "label",
                props: {
                    slot: CheckboxSlot.label,
                    children: "Default"
                }
            }
        },
        {
            checked: true,
            children: {
                id: "label",
                props: {
                    slot: CheckboxSlot.label,
                    children: "Checked (controlled)"
                }
            }
        },
        {
            disabled: true,
            children: {
                id: "label",
                props: {
                    slot: CheckboxSlot.label,
                    children: "Disabled"
                }
            }
        },
        {
            indeterminate: true,
            children: {
                id: "label",
                props: {
                    slot: CheckboxSlot.label,
                    children: "Indeterminate"
                }
            }
        },
        {
            indeterminate: true,
            checked: true,
            children: {
                id: "label",
                props: {
                    slot: CheckboxSlot.label,
                    children: "Indeterminate checked (controlled)"
                }
            }
        }
    ]
} as ComponentFactoryExample<CheckboxProps>;
