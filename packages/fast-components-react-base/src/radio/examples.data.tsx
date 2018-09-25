import * as React from "react";
import Radio, { IRadioHandledProps, IRadioManagedClasses, IRadioUnhandledProps } from "./radio";
import schema from "./radio.schema.json";
import Documentation from "./.tmp/documentation";
import { IComponentFactoryExample } from "@microsoft/fast-development-site-react";
import Label from "../label";

const classes: IRadioManagedClasses = {
    managedClasses: {
        radio: "radio",
        radio__disabled: "radio__disabled",
        radio_input: "radio_input",
        radio_stateIndicator: "radio_stateIndicator"
    }
};

const examples: IComponentFactoryExample<IRadioHandledProps & IRadioManagedClasses> = {
    name: "Radio",
    component: Radio,
    schema: schema as any,
    documentation: <Documentation />,
    detailData: {
        ...classes,
        checked: true
    },
    data: [
        {
            ...classes,
            checked: true
        },
        {
            ...classes,
            disabled: true
        }
    ]
};

export default examples;
