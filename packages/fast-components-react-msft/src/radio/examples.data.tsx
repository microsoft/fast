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
        children: "Radio"
    },
    data: [
        {
            children: "Default"
        },
        {
            tag: "div",
            children: "div tag"
        },
        {
            tag: "label",
            children: "label tag"
        },
        {
            checked: true,
            children: "Checked"
        },
        {
            disabled: true,
            children: "Disabled"
        }
    ]
} as IComponentFactoryExample<IRadioHandledProps>;
