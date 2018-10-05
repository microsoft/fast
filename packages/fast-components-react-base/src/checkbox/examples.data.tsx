import * as React from "react";
import Checkbox, { CheckboxHandledProps, CheckboxManagedClasses, CheckboxUnhandledProps } from "./checkbox";
import schema from "./checkbox.schema.json";
import Documentation from "./.tmp/documentation";
import { ComponentFactoryExample } from "@microsoft/fast-development-site-react";

const classes: CheckboxManagedClasses = {
    managedClasses: {
        checkbox: "checkbox",
        checkbox_input: "checkbox_input",
        checkbox_label: "checkbox_label",
        checkbox__disabled: "checkbox__disabled",
        checkbox_stateIndicator: "checkbox_stateIndicator"
    }
};

const examples: ComponentFactoryExample<CheckboxHandledProps> = {
    name: "Checkbox",
    component: Checkbox,
    schema: schema as any,
    documentation: <Documentation />,
    detailData: {
        ...classes,
        checked: true
    },
    data: [
        {
            ...classes
        },
        {
            ...classes,
            checked: true
        },
        {
            ...classes,
            indeterminate: true
        },
        {
            ...classes,
            disabled: true
        }
    ]
};

export default examples;
