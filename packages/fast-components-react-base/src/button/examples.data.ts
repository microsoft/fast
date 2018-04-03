import {ICategoryItemProps} from "@microsoft/fast-development-site-react";
import {ISnapshotTestSuite} from "@microsoft/fast-jest-snapshots-react";
import {IManagedClasses} from "@microsoft/fast-components-class-name-contracts";
import Button, {IButtonHandledProps, IButtonMangedClasses, IButtonUnhandledProps} from "./button";
import * as React from "react";

const examples: ISnapshotTestSuite<IButtonHandledProps & IButtonMangedClasses> = {
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
