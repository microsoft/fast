import * as React from "react";
import { ICategoryItemProps } from "@microsoft/fast-development-site-react";
import { ISnapshotTestSuite } from "@microsoft/fast-jest-snapshots-react";
import { IManagedClasses } from "@microsoft/fast-components-class-name-contracts-base";
import TextField, {
    ITextFieldHandledProps,
    ITextFieldManagedClasses,
    ITextFieldUnhandledProps,
    TextFieldType
} from "./text-field";

const examples: ISnapshotTestSuite<ITextFieldHandledProps & ITextFieldManagedClasses> = {
    name: "textfield",
    component: TextField,
    data: [
        {
            managedClasses: {
                textField: "textfield"
            },
            type: TextFieldType.text
        },
        {
            managedClasses: {
                textField: "textfield"
            },
            type: TextFieldType.email
        },
        {
            managedClasses: {
                textField: "textfield"
            },
            type: TextFieldType.number
        },
        {
            managedClasses: {
                textField: "textfield"
            },
            type: TextFieldType.tel
        }
    ]
};

export default examples;
