import { ICategoryItemProps } from "@microsoft/fast-development-site-react";
import { ISnapshotTestSuite } from "@microsoft/fast-jest-snapshots-react";
import { IManagedClasses } from "@microsoft/fast-jss-manager-react";
import TextField from "./index";
import { ITextfieldHandledProps, TextFieldType } from "@microsoft/fast-components-react-base";
import * as React from "react";

export default {
    name: "textfield",
    component: TextField,
    data: [
        {
            placeholder: "Placeholder",
            type: TextFieldType.text,
        },
        {
            type: TextFieldType.email,
            defaultValue: "jasfalk@microsoft.com"
        },
        {
            type: TextFieldType.number,
            defaultValue: "12345"
        },
        {
            type: TextFieldType.tel,
            defaultValue: "(201) 867-5309"
        },
        {
            disabled: true,
            type: TextFieldType.text,
            defaultValue: "Disabled"
        },
        {
            placeholder: "Enter Password",
            type: TextFieldType.password
        },
        {
            placeholder: "Error",
            type: TextFieldType.text
        }
    ]
} as ISnapshotTestSuite<ITextfieldHandledProps>;
