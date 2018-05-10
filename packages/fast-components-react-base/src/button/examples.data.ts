import { ICategoryItemProps } from "@microsoft/fast-development-site-react";
import { ISnapshotTestSuite } from "@microsoft/fast-jest-snapshots-react";
import { IManagedClasses } from "@microsoft/fast-components-class-name-contracts-base";
import Button, { IButtonHandledProps, IButtonManagedClasses, IButtonUnhandledProps } from "./button";
import * as schema from "./button.schema.json";
import * as React from "react";

const examples: ISnapshotTestSuite<IButtonHandledProps & IButtonManagedClasses> = {
    name: "button",
    component: Button,
    schema: schema,
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
