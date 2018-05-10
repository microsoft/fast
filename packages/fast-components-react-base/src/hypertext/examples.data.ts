import { ICategoryItemProps } from "@microsoft/fast-development-site-react";
import { ISnapshotTestSuite } from "@microsoft/fast-jest-snapshots-react";
import { IManagedClasses } from "@microsoft/fast-components-class-name-contracts-base";
import Hypertext, { IHypertextHandledProps, IHypertextManagedClasses, IHypertextUnhandledProps } from "./hypertext";
import * as schema from "./hypertext.schema.json";
import * as React from "react";

const examples: ISnapshotTestSuite<IHypertextHandledProps & IHypertextManagedClasses> = {
    name: "hypertext",
    component: Hypertext,
    schema,
    data: [
        {
            managedClasses: {
                hypertext: "hypertext"
            },
            href: "https://msdn.microsoft.com/en-us/",
            children: "MSDN"
        }
    ]
};

export default examples;
