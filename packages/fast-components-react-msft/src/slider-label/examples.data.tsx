import React from "react";
import { ComponentFactoryExample } from "@microsoft/fast-development-site-react";
import schema from "./slider-label.schema.json";
import { SliderLabel, SliderLabelHandledProps } from "./index";
import Documentation from "./.tmp/documentation";

const examples: ComponentFactoryExample<SliderLabelHandledProps> = {
    name: "Slider label",
    component: SliderLabel,
    schema: schema as any,
    documentation: <Documentation />,
    detailData: {
        label: "sample label",
        showTickmark: true,
    },
    data: [
        {
            label: "sample label",
            showTickmark: true,
        },
    ],
};

export default examples;
