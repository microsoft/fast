import React from "react";
import Radio, {
    RadioHandledProps,
    RadioManagedClasses,
    RadioUnhandledProps,
} from "./radio";
import schema from "./radio.schema.json";
import Documentation from "./.tmp/documentation";
import { ComponentFactoryExample } from "@microsoft/fast-development-site-react";

const classes: RadioManagedClasses = {
    managedClasses: {
        radio: "radio",
        radio__disabled: "radio__disabled",
        radio_input: "radio_input",
        radio_label: "radio_label",
        radio_stateIndicator: "radio_stateIndicator",
    },
};

const examples: ComponentFactoryExample<RadioHandledProps & RadioManagedClasses> = {
    name: "Radio",
    component: Radio,
    schema: schema as any,
    documentation: <Documentation />,
    detailData: {
        inputId: "radio01",
        ...classes,
        checked: true,
    },
    data: [
        {
            inputId: "checked_true",
            ...classes,
            checked: true,
        },
        {
            inputId: "checked_false",
            ...classes,
            checked: false,
        },
        {
            inputId: "checked_none",
            name: "radio-name",
            ...classes,
        },
        {
            inputId: "disabled",
            ...classes,
            disabled: true,
        },
    ],
};

export default examples;
