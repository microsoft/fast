import React from "react";
import Button, {
    ButtonHandledProps,
    ButtonManagedClasses,
    ButtonUnhandledProps,
} from "./button";
import { buttonSchema } from "../index";
import Documentation from "./.tmp/documentation";
import { ComponentFactoryExample } from "@microsoft/fast-development-site-react";

const examples: ComponentFactoryExample<ButtonHandledProps> = {
    name: "Button",
    component: Button,
    schema: buttonSchema as any,
    documentation: <Documentation />,
    detailData: {
        managedClasses: {
            button: "button",
        },
        children: "Button",
    },
    data: [
        {
            managedClasses: {
                button: "button",
            },
            children: "Button text",
        },
    ],
};

export default examples;
