import * as React from "react";
import { ISnapshotTestSuite } from "@microsoft/fast-jest-snapshots-react";
import { IManagedClasses } from "@microsoft/fast-components-class-name-contracts-base";
import Divider, { IDividerHandledProps, IDividerManagedClasses, IDividerUnhandledProps } from "./divider";
import * as schema from "./divider.schema.json";
import Documentation from "./.tmp/documentation";

const examples: ISnapshotTestSuite<IDividerHandledProps & IDividerManagedClasses> = {
    name: "Divider",
    component: Divider,
    schema: schema as any,
    documentation: <Documentation />,
    detailData: {
        managedClasses: {
            divider: "divider"
        }
    },
    data: [
        {
            managedClasses: {
                divider: "divider"
            }
        }
    ]
};

export default examples;
