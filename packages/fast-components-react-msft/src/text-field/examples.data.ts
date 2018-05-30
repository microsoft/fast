import { ISnapshotTestSuite } from "@microsoft/fast-jest-snapshots-react";
import { IManagedClasses } from "@microsoft/fast-jss-manager-react";
import TextField from "./index";
import { ITextFieldHandledProps, TextFieldType } from "@microsoft/fast-components-react-base";
import * as schema from "@microsoft/fast-components-react-base/dist/text-field/text-field.schema.json";

export default {
    name: "text field",
    component: TextField,
    schema: schema as any,
    data: [
        {
            placeholder: "Placeholder",
            type: TextFieldType.text,
        },
        {
            type: TextFieldType.email,
            defaultValue: "name@email.com"
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
        }
    ]
} as ISnapshotTestSuite<ITextFieldHandledProps>;
