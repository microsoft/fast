import * as React from "react";
import Button, { ButtonHandledProps, ButtonManagedClasses, ButtonUnhandledProps } from "./button";
import schema from "./button.schema.json";
import Documentation from "./.tmp/documentation";
import { ComponentFactoryExample } from "@microsoft/fast-development-site-react";

const examples: ComponentFactoryExample<ButtonHandledProps> = {
    name: "Button",
    component: Button,
    schema: schema as any,
    documentation: <Documentation />,
    detailData: {
        managedClasses: {
            button: "button"
        },
        children: "Button"
    },
    data: [
        {
            managedClasses: {
                button: "button"
            },
            children: "Button text"
        }
    ]
};

export default examples;
