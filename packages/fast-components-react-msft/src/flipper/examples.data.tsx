import * as React from "react";
import { ISnapshotTestSuite } from "@microsoft/fast-jest-snapshots-react";
import { IManagedClasses } from "@microsoft/fast-jss-manager-react";
import Flipper from "./index";
import { IButtonHandledProps as IBaseButtonHandledProps } from "@microsoft/fast-components-react-base";
import {
    FlipperDirection,
    IFlipperHandledProps,
    IFlipperManagedClasses,
    IFlipperUnhandledProps
} from "./flipper.props";
import schema from "./flipper.schema.json";
import Documentation from "./.tmp/documentation";

export default {
    name: "Flipper",
    component: Flipper,
    schema: schema as any,
    documentation: <Documentation />,
    detailData: {
        ariaHidden: true
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
} as ISnapshotTestSuite<IFlipperHandledProps>;
