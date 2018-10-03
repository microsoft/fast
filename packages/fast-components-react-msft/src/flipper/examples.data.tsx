import * as React from "react";
import { IComponentFactoryExample } from "@microsoft/fast-development-site-react";
import { Flipper, FlipperDirection, FlipperProps } from "./index";
import {
} from "./flipper.props";
import schema from "./flipper.schema.json";
import Documentation from "./.tmp/documentation";

export default {
    name: "Flipper",
    component: Flipper,
    schema: schema as any,
    documentation: <Documentation />,
    detailData: {
        "aria-hidden": true
    },
    data: [
        {
            "data-sketch-symbol": "Flipper - default"
        },
        {
            direction: FlipperDirection.previous
        },
        {
            direction: FlipperDirection.next,
            visible: true,
            label: "See next"
        },
        {
            direction: FlipperDirection.previous,
            visible: true,
            label: "See previous"
        }
    ]
} as IComponentFactoryExample<FlipperProps>;
