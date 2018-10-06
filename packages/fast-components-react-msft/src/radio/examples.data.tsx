import * as React from "react";
import { ComponentFactoryExample } from "@microsoft/fast-development-site-react";
import Radio from "./index";
import { RadioHandledProps } from "@microsoft/fast-components-react-base";
import schema from "@microsoft/fast-components-react-base/dist/radio/radio.schema.json";
import Documentation from "./.tmp/documentation";
import { Label } from "../label";
import { noop } from "lodash-es";
import labelSchema from "../../../fast-components-react-base/src/label/label.schema.json";

const slotRadioExample: any = {
    id: labelSchema.id,
    props: {
        slot: "label",
        htmlFor: "radio01",
        children: "Label"
    }
};

const slotCheckedExample: any = {
    id: labelSchema.id,
    props: {
        slot: "label",
        htmlFor: "checked",
        children: "Label Controlled (Checked)"
    }
};

const slotDisabledExample: any = {
    id: labelSchema.id,
    props: {
        slot: "label",
        htmlFor: "disabled",
        children: "Label (Disabled)"
    }
};

export default {
    name: "Radio",
    component: Radio,
    schema: schema as any,
    documentation: <Documentation />,
    detailData: {
        children: slotRadioExample,
        id: "radio01"
    },
    data: [
        {
            children: slotRadioExample,
            id: "radio01"
        },
        {
            checked: true,
            onChange: noop,
            children: slotCheckedExample,
            id: "checked",
        },
        {
            disabled: true,
            children: slotDisabledExample,
            id: "disabled"
        }
    ]
} as ComponentFactoryExample<RadioHandledProps>;
