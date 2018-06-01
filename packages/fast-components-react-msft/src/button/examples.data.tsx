import * as React from "react";
import { ISnapshotTestSuite } from "@microsoft/fast-jest-snapshots-react";
import { IManagedClasses } from "@microsoft/fast-jss-manager-react";
import Button from "./index";
import { IButtonHandledProps as IBaseButtonHandledProps } from "@microsoft/fast-components-react-base";
import {
    ButtonProps,
    IButtonHandledProps,
    IButtonManagedClasses,
    IButtonUnhandledProps
} from "./button.props";
import * as schema from "./button.schema.json";
import Documentation from "./.tmp/documentation";

export default {
    name: "button",
    component: Button,
    schema: schema as any,
    documentation: <Documentation />,
    detailData: {
        children: "Button"
    },
    data: [
        {
            children: "Default button",
            "data-sketch-symbol": "Default button"
        },
        {
            primary: true,
            children: "Primary (submit) button",
            "data-sketch-symbol": "Primary button"
        },
        {
            outline: true,
            children: "Outline button",
            "data-sketch-symbol": "Outline button"
        },
        {
            lightweight: true,
            children: "Lightweight button",
            "data-sketch-symbol": "Lightweight button"
        },
        {
            justified: true,
            children: "Justified button",
            "data-sketch-symbol": "Justified button"
        },
        {
            href: "#",
            children: "Anchor"
        },
        {
            disabled: true,
            children: "Default button",
            "data-sketch-symbol": "Disabled default button"
        },
        {
            disabled: true,
            primary: true,
            children: "Primary (submit) button",
            "data-sketch-symbol": "Disabled primary button"
        },
        {
            disabled: true,
            outline: true,
            children: "Outline button",
            "data-sketch-symbol": "Disabled outline button"
        },
        {
            disabled: true,
            lightweight: true,
            children: "Lightweight button",
            "data-sketch-symbol": "Disabled lightweight button"
        },
        {
            disabled: true,
            justified: true,
            children: "Justified button",
            "data-sketch-symbol": "Disabled justified button"
        },
        {
            disabled: true,
            href: "#",
            children: "Anchor",
            "data-sketch-symbol": "Disabled anchor button"
        }
    ]
} as ISnapshotTestSuite<IButtonHandledProps>;
