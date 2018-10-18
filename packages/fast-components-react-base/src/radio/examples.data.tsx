import * as React from "react";
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
        id: "radio01",
        ...classes,
        checked: true,
    },
    data: [
        {
            id: "checked_true",
            ...classes,
            checked: true,
        },
        {
            id: "checked_false",
            ...classes,
            checked: false,
        },
        {
            id: "checked_none",
            ...classes,
        },
        {
            id: "disabled",
            ...classes,
            disabled: true,
        },
    ],
};

export default examples;
