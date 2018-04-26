import * as React from "react";
import { ICategoryItemProps } from "@microsoft/fast-development-site-react";
import { ISnapshotTestSuite } from "@microsoft/fast-jest-snapshots-react";
import { IManagedClasses } from "@microsoft/fast-jss-manager-react";
import Button from "./index";
import { IButtonHandledProps } from "@microsoft/fast-components-react-base";
import {
    IMSFTButtonHandledProps,
    IMSFTButtonManagedClasses,
    IMSFTButtonUnhandledProps,
    MSFTButtonProps
} from "./button.props";
export default {
    name: "button",
    component: Button,
    data: [
        {
            children: "Default button"
        },
        {
            primary: true,
            children: "Primary (submit) button"
        },
        {
            outline: true,
            children: "Outline button"
        },
        {
            lightweight: true,
            children: "Lightweight button"
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
            children: "Default button"
        },
        {
            disabled: true,
            primary: true,
            children: "Primary (submit) button"
        },
        {
            disabled: true,
            outline: true,
            children: "Outline button"
        },
        {
            disabled: true,
            lightweight: true,
            children: "Lightweight button"
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
