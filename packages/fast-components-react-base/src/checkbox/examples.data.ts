import { ICategoryItemProps } from "@microsoft/fast-development-site-react";
import { ISnapshotTestSuite } from "@microsoft/fast-jest-snapshots-react";
import { IManagedClasses } from "@microsoft/fast-components-class-name-contracts-base";
import Checkbox, { CheckboxHTMLTags, ICheckboxHandledProps,  ICheckboxManagedClasses, ICheckboxUnhandledProps  } from "./checkbox";
import * as React from "react";

const classes: ICheckboxManagedClasses = {
    managedClasses: {
        checkbox: "checkbox",
        checkbox_input: "checkbox_input",
        checkbox_label: "checkbox_label",
        checkbox_disabled: "checkbox_disabled",
        checkbox_span: "checkbox_span"
    }
};

const examples: ISnapshotTestSuite<ICheckboxHandledProps & ICheckboxManagedClasses> = {
    name: "checkbox",
    component: Checkbox,
    data: [
        {
            ...classes
        },
        {
            ...classes,
            tag: "foobar" as any
        },
        {
            ...classes,
            tag: CheckboxHTMLTags.div
        },
        {
            ...classes,
            tag: CheckboxHTMLTags.label
        },
        {
            ...classes,
            checked: true
        },
        {
            ...classes,
            indeterminate: true,
            checked: true
        },
        {
            ...classes,
            disabled: true
        }
    ]
};

export default examples;
