import {ICategoryItemProps} from "@microsoft/fast-development-site-react";
// import {IComponentExamples} from "../../../../test/component-examples";
import {IManagedClasses} from "@microsoft/fast-components-class-name-contracts";
import Button, {IButtonHandledProps, IButtonMangedClasses, IButtonUnhandledProps} from "./button";
import * as React from "react";

// const examples: IComponentExamples<IButtonHandledProps & IButtonMangedClasses> = {
const examples: any = {
    name: "button",
    component: Button,
    data: [
        {
            managedClasses: {
                button: "button"
            },
            children: "Button text"
        },
        {
            managedClasses: {
                button: "button-2"
            },
            children: "Button text"
        }
    ]
};

export default examples;
