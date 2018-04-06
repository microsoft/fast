import { ICategoryItemProps } from "@microsoft/fast-development-site-react";
import { ISnapshotTestSuite } from "@microsoft/fast-jest-snapshots-react";
import { IManagedClasses } from "@microsoft/fast-jss-manager-react";
import Hypertext from "./index";
import { IHypertextHandledProps } from "@microsoft/fast-components-react-base";
import * as React from "react";

export default {
    name: "hypertext",
    component: Hypertext,
    data: [
        {
            href: "https://msdn.microsoft.com",
            children: "Hypertext"
        }
    ]
} as ISnapshotTestSuite<IHypertextHandledProps>;
