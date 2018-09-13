import * as React from "react";
import Radio, { IRadioHandledProps, IRadioManagedClasses, IRadioUnhandledProps, RadioHTMLTags } from "./radio";
import schema from "./radio.schema.json";
import Documentation from "./.tmp/documentation";
import { IComponentFactoryExample } from "@microsoft/fast-development-site-react";

const classes: IRadioManagedClasses = {
    managedClasses: {
        radio: "radio",
        radio_disabled: "radio_disabled",
        radio_input: "radio_input",
        radio_label: "radio_label",
        radio_span: "radio_stateIndicator"
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
            tag: RadioHTMLTags.div
        },
        {
            ...classes,
            tag: RadioHTMLTags.label
        },
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
