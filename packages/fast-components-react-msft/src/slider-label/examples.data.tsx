import React from "react";
import { ComponentFactoryExample } from "@microsoft/fast-development-site-react";
import { SliderLabel, SliderLabelHandledProps, sliderLabelSchema } from "./index";
import Documentation from "./.tmp/documentation";

const examples: ComponentFactoryExample<SliderLabelHandledProps> = {
    name: "Slider label",
    component: SliderLabel,
    schema: sliderLabelSchema as any,
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
