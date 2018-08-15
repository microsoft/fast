import * as React from "react";
import { IManagedClasses } from "@microsoft/fast-components-class-name-contracts-base";
import Button, { IButtonHandledProps, IButtonManagedClasses, IButtonUnhandledProps } from "./button";
import schema from "./button.schema.json";
import Documentation from "./.tmp/documentation";
import { IComponentFactoryExample } from "@microsoft/fast-development-site-react";

const examples: IComponentFactoryExample<IButtonHandledProps & IButtonManagedClasses> = {
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
