import * as React from "react";
import { ISnapshotTestSuite } from "@microsoft/fast-jest-snapshots-react";
import { IManagedClasses } from "@microsoft/fast-jss-manager-react";
import Button from "./index";
import { IButtonHandledProps as IBaseButtonHandledProps } from "@microsoft/fast-components-react-base";
import {
    ButtonProps,
    IButtonHandledProps,
    IButtonManagedClasses,
    IButtonUnhandledProps,
    Subtype
} from "./button.props";
import schema from "./button.schema.json";
import Documentation from "./.tmp/documentation";

export default {
    name: "Button",
    component: Button,
    schema: schema as any,
    documentation: <Documentation />,
    detailData: {
        children: "Button"
    },
    data: [
        {
            children: "Default button",
            "data-sketch-symbol": "Button - default"
        },
        {
            subtype: Subtype.primary,
            children: "Primary (submit) button",
            "data-sketch-symbol": "Button - primary"
        },
        {
            subtype: Subtype.outline,
            children: "Outline button",
            "data-sketch-symbol": "Button - outline"
        },
        {
            subtype: Subtype.lightweight,
            children: "Lightweight button",
            "data-sketch-symbol": "Button - lightweight"
        },
        {
            subtype: Subtype.justified,
            children: "Justified button"
        },
        {
            href: "#",
            children: "Anchor"
        },
        {
            disabled: true,
            children: "Default button",
            "data-sketch-symbol": "Button - default disabled"
        },
        {
            disabled: true,
            subtype: Subtype.primary,
            children: "Primary (submit) button",
            "data-sketch-symbol": "Button - primary disabled"
        },
        {
            disabled: true,
            subtype: Subtype.outline,
            children: "Outline button",
            "data-sketch-symbol": "Button - outline disabled"
        },
        {
            disabled: true,
            subtype: Subtype.lightweight,
            children: "Lightweight button",
            "data-sketch-symbol": "Button - lightweight disabled"
        },
        {
            disabled: true,
            subtype: Subtype.justified,
            children: "Justified button"
        },
        {
            disabled: true,
            href: "#",
            children: "Anchor"
        }
    ]
} as ISnapshotTestSuite<IButtonHandledProps>;
