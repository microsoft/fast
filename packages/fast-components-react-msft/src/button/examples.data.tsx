import * as React from "react";
import { IManagedClasses } from "@microsoft/fast-jss-manager-react";
import Button from "./index";
import { IButtonHandledProps as IBaseButtonHandledProps } from "@microsoft/fast-components-react-base";
import {
    ButtonAppearance,
    ButtonProps,
    IButtonHandledProps,
    IButtonManagedClasses,
    IButtonUnhandledProps
} from "./button.props";
import schema from "./button.schema.json";
import Documentation from "./.tmp/documentation";
import { IComponentFactoryExample } from "@microsoft/fast-development-site-react";

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
            children: "Secondary button",
            "data-sketch-symbol": "Button - default"
        },
        {
            appearance: ButtonAppearance.primary,
            children: "Primary (submit) button",
            "data-sketch-symbol": "Button - primary"
        },
        {
            appearance: ButtonAppearance.outline,
            children: "Outline button",
            "data-sketch-symbol": "Button - outline"
        },
        {
            appearance: ButtonAppearance.lightweight,
            children: "Lightweight button",
            "data-sketch-symbol": "Button - lightweight"
        },
        {
            appearance: ButtonAppearance.justified,
            children: "Justified button"
        },
        {
            href: "#",
            children: "Anchor"
        },
        {
            disabled: true,
            children: "Secondary button",
            "data-sketch-symbol": "Button - default disabled"
        },
        {
            disabled: true,
            appearance: ButtonAppearance.primary,
            children: "Primary (submit) button",
            "data-sketch-symbol": "Button - primary disabled"
        },
        {
            disabled: true,
            appearance: ButtonAppearance.outline,
            children: "Outline button",
            "data-sketch-symbol": "Button - outline disabled"
        },
        {
            disabled: true,
            appearance: ButtonAppearance.lightweight,
            children: "Lightweight button",
            "data-sketch-symbol": "Button - lightweight disabled"
        },
        {
            disabled: true,
            appearance: ButtonAppearance.justified,
            children: "Justified button"
        },
        {
            disabled: true,
            href: "#",
            children: "Anchor"
        }
    ]
} as IComponentFactoryExample<IButtonHandledProps>;
