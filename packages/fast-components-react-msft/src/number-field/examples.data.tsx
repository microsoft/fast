import * as React from "react";
import { ComponentFactoryExample } from "@microsoft/fast-development-site-react";
import { NumberField, NumberFieldProps } from "./index";
import schema from "@microsoft/fast-components-react-base/dist/label/label.schema.json";
import Documentation from "./.tmp/documentation";

export default {
    name: "NumberField",
    component: NumberField,
    schema: schema as any,
    documentation: <Documentation />,
    detailData: {
        step: 0.1,
    },
    data: [
        {
            step: 0.1,
        },
    ],
} as ComponentFactoryExample<NumberFieldProps>;
