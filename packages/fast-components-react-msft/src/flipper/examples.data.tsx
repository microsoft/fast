import React from "react";
import { ComponentFactoryExample } from "@microsoft/fast-development-site-react";
import { Flipper, FlipperDirection, FlipperProps } from "./index";
import schema from "./flipper.schema.json";
import Documentation from "./.tmp/documentation";

export default {
    name: "Flipper",
    component: Flipper,
    schema: schema as any,
    documentation: <Documentation />,
    detailData: {
        "aria-hidden": true,
    },
    data: [
        {
            "data-sketch-symbol": "Flipper - default",
        },
        {
            direction: FlipperDirection.previous,
        },
        {
            direction: FlipperDirection.next,
            visibleToAssistiveTechnologies: true,
            label: "See next",
        },
        {
            direction: FlipperDirection.previous,
            visibleToAssistiveTechnologies: true,
            label: "See previous",
        },
    ],
} as ComponentFactoryExample<FlipperProps>;
