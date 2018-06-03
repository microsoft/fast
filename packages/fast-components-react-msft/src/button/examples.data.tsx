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
            "data-sketch-symbol": "Button - default"
        },
        {
            primary: true,
            children: "Primary (submit) button",
            "data-sketch-symbol": "Button - primary"
        },
        {
            outline: true,
            children: "Outline button",
            "data-sketch-symbol": "Button - outline"
        },
        {
            lightweight: true,
            children: "Lightweight button",
            "data-sketch-symbol": "Button - lightweight"
        },
        {
            justified: true,
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
            primary: true,
            children: "Primary (submit) button",
            "data-sketch-symbol": "Button - primary disabled"
        },
        {
            disabled: true,
            outline: true,
            children: "Outline button",
            "data-sketch-symbol": "Button - outline disabled"
        },
        {
            disabled: true,
            lightweight: true,
            children: "Lightweight button",
            "data-sketch-symbol": "Button - lightweight disabled"
        },
        {
            disabled: true,
            justified: true,
            children: "Justified button"
        },
        {
            disabled: true,
            href: "#",
            children: "Anchor"
        }
    ]
} as ISnapshotTestSuite<IButtonHandledProps>;
