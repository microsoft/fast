import { ICategoryItemProps } from "@microsoft/fast-development-site-react";
import { ISnapshotTestSuite } from "@microsoft/fast-jest-snapshots-react";
import { IManagedClasses } from "@microsoft/fast-components-class-name-contracts-base";
import Divider, { IDividerHandledProps, IDividerManagedClasses, IDividerUnhandledProps } from "./divider";
import * as React from "react";

const examples: ISnapshotTestSuite<IDividerHandledProps & IDividerManagedClasses> = {
    name: "divider",
    component: Divider,
    data: [
        {
            managedClasses: {
                divider: "divider"
            }
        }
    ]
};

export default examples;
