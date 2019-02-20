import * as React from "react";
import { ComponentFactoryExample } from "@microsoft/fast-development-site-react";
import { NumberField, NumberFieldProps } from "./index";
import schema from "@microsoft/fast-components-react-base/dist/number-field/number-field.schema.json";
import Documentation from "./.tmp/documentation";

export default {
    name: "Number field",
    component: NumberField,
    schema: schema as any,
    documentation: <Documentation />,
    detailData: {
        name: "Number field",
        step: 10,
        min: 0,
        max: 100,
        defaultValue: 0,
    } as any,
    data: [
        {
            step: 0.1,
        },
        {
            min: 1,
        },
        {
            max: 100,
        },
        {
            value: 100,
        },
        {
            defaultValue: 0,
        },
        {
            disabled: true,
        },
        {
            readOnly: true,
        },
        {
            required: true,
        },
        {
            placeholder: "Placeholder",
        },
        {
            name: "Name",
        } as any,
    ],
} as ComponentFactoryExample<NumberFieldProps>;
