import { ISnapshotTestSuite } from "@microsoft/fast-jest-snapshots-react";
import { IManagedClasses } from "@microsoft/fast-components-class-name-contracts-base";
import Divider, { IDividerHandledProps, IDividerManagedClasses, IDividerUnhandledProps } from "./divider";
import * as schema from "./divider.schema.json";
import * as React from "react";

const examples: ISnapshotTestSuite<IDividerHandledProps & IDividerManagedClasses> = {
    name: "divider",
    component: Divider,
    schema: schema as any,
    data: [
        {
            managedClasses: {
                divider: "divider"
            }
        }
    ]
};

export default examples;
