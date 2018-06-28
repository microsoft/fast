import { ISnapshotTestSuite } from "@microsoft/fast-jest-snapshots-react";
import { IManagedClasses } from "@microsoft/fast-components-class-name-contracts-base";
import TextField, {
    ITextFieldHandledProps,
    ITextFieldManagedClasses,
    ITextFieldUnhandledProps,
    TextFieldType
} from "./text-field";
import * as schema from "./text-field.schema.json";
import * as React from "react";
import Documentation from "./.tmp/documentation";

const examples: ISnapshotTestSuite<ITextFieldHandledProps & ITextFieldManagedClasses> = {
    name: "Text field",
    component: TextField,
    schema: schema as any,
    documentation: <Documentation />,
    detailData: {
        managedClasses: {
            textField: "textfield"
        },
        type: TextFieldType.text
    },
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
