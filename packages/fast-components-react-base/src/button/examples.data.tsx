import * as React from "react";
import { ISnapshotTestSuite } from "@microsoft/fast-jest-snapshots-react";
import { IManagedClasses } from "@microsoft/fast-components-class-name-contracts-base";
import Button, { IButtonHandledProps, IButtonManagedClasses, IButtonUnhandledProps } from "./button";
import * as schema from "./button.schema.json";
import Documentation from "./.tmp/documentation";

const examples: ISnapshotTestSuite<IButtonHandledProps & IButtonManagedClasses> = {
    name: "button",
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
