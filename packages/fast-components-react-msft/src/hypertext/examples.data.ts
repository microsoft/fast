import { ISnapshotTestSuite } from "@microsoft/fast-jest-snapshots-react";
import { IManagedClasses } from "@microsoft/fast-jss-manager-react";
import Hypertext from "./index";
import { IHypertextHandledProps } from "@microsoft/fast-components-react-base";
import * as schema from "@microsoft/fast-components-react-base/dist/hypertext/hypertext.schema.json";
import * as React from "react";

export default {
    name: "hypertext",
    component: Hypertext,
    schema: schema as any,
    data: [
        {
            href: "https://msdn.microsoft.com",
            children: "Hypertext"
        },
        {
            children: "Hypertext"
        }
    ]
} as ISnapshotTestSuite<IHypertextHandledProps>;
