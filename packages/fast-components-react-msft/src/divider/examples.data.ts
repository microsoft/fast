import { ICategoryItemProps } from "@microsoft/fast-development-site-react";
import { ISnapshotTestSuite } from "@microsoft/fast-jest-snapshots-react";
import { IManagedClasses } from "@microsoft/fast-jss-manager-react";
import Divider from "./index";
import { DividerRoles, IDividerHandledProps } from "@microsoft/fast-components-react-base";
import * as schema from "@microsoft/fast-components-react-base/dist/divider/divider.schema.json";

export default {
    name: "divider",
    component: Divider,
    schema,
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
