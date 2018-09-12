import * as React from "react";
import { IComponentFactoryExample } from "@microsoft/fast-development-site-react";
import Radio from "./index";
import { IRadioHandledProps } from "@microsoft/fast-components-react-base";
import schema from "@microsoft/fast-components-react-base/dist/radio/radio.schema.json";
import Documentation from "./.tmp/documentation";

export default {
    name: "Radio",
    component: Radio,
    schema: schema as any,
    documentation: <Documentation />,
    detailData: {
        text: "Radio"
    },
    data: [
        {
            text: "Default"
        },
        {
            tag: "div",
            text: "div tag"
        },
        {
            tag: "label",
            text: "label tag"
        },
        {
            checked: true,
            text: "Checked"
        },
        {
            disabled: true,
            text: "Disabled"
        }
    ]
} as IComponentFactoryExample<IRadioHandledProps>;
