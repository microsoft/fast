import * as React from "react";
import { ISnapshotTestSuite } from "@microsoft/fast-jest-snapshots-react";
import { IManagedClasses } from "@microsoft/fast-jss-manager-react";
import Divider from "./index";
import { DividerRoles, IDividerHandledProps } from "@microsoft/fast-components-react-base";
import * as schema from "@microsoft/fast-components-react-base/dist/divider/divider.schema.json";
import Documentation from "./.tmp/documentation";

export default {
    name: "divider",
    component: Divider,
    schema: schema as any,
    documentation: <Documentation />,
    detailData: {
        role: void 0
    },
    data: [
        {
            role: void 0
        },
        {
            role: DividerRoles.presentation
        },
        {
            role: DividerRoles.separator
        }
    ]
} as ISnapshotTestSuite<IDividerHandledProps>;
