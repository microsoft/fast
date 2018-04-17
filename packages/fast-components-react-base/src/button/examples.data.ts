import { ICategoryItemProps } from "@microsoft/fast-development-site-react";
import { ISnapshotTestSuite } from "@microsoft/fast-jest-snapshots-react";
import { IManagedClasses } from "@microsoft/fast-components-class-name-contracts-base";
import Button, { IButtonHandledProps, IButtonManagedClasses, IButtonUnhandledProps } from "./button";
import * as React from "react";

const examples: ISnapshotTestSuite<IButtonHandledProps & IButtonManagedClasses> = {
    name: "button",
    component: Button,
    data: [
        {
            managedClasses: {
                button: "button",
                button_primary: "button-primary",
                button_outline: "button-outline",
                button_lightweight: "button-lightweight",
                button_justified: "button-justified",
            },
            children: "Button text"
        }
    ]
};

export default examples;
