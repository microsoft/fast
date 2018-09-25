import * as React from "react";
import { IComponentFactoryExample } from "@microsoft/fast-development-site-react";
import Radio from "./index";
import { IRadioHandledProps } from "@microsoft/fast-components-react-base";
import schema from "@microsoft/fast-components-react-base/dist/radio/radio.schema.json";
import Documentation from "./.tmp/documentation";
import { Label } from "../label";

const slotRadioExample: JSX.Element = (
    <Label slot="label">
        Label
    </Label>
);

const slotCheckedExample: JSX.Element = (
    <Label slot="label">
        Label Controlled (Checked)
    </Label>
);

const slotDisabledExample: JSX.Element = (
    <Label slot="label">
        Label (Disabled)
    </Label>
);

const slotNoLabelExample: JSX.Element = (
    <div slot="label">
        div label
    </div>
);

export default {
    name: "Radio",
    component: Radio,
    schema: schema as any,
    documentation: <Documentation />,
    detailData: {
        children: [slotRadioExample],
        id: "radio01"
    },
    data: [
        {
            children: [slotRadioExample],
            id: "radio01"
        },
        {
            checked: true,
            children: [slotCheckedExample],
            id: "checked"
        },
        {
            disabled: true,
            children: [slotDisabledExample],
            id: "disabled"
        },
        {
            children: [slotNoLabelExample],
            id: "divLabel"
        }
    ]
} as IComponentFactoryExample<IRadioHandledProps>;
