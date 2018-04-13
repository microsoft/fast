import { ICategoryItemProps } from "@microsoft/fast-development-site-react";
import { ISnapshotTestSuite } from "@microsoft/fast-jest-snapshots-react";
import { IManagedClasses } from "@microsoft/fast-components-class-name-contracts";
import Checkbox, { ICheckboxHandledProps, ICheckboxManagedClasses, ICheckboxUnhandledProps } from "./checkbox";
import * as React from "react";

const examples: ISnapshotTestSuite<ICheckboxHandledProps & ICheckboxManagedClasses> = {
    name: "checkbox",
    component: Checkbox,
    data: [
        {
            managedClasses: {
                checkbox: "checkbox",
                checkbox_input: "checkbox-input",
                checkbox_label: "checkbox-label"
            }
        }
    ]
};

export default examples;
