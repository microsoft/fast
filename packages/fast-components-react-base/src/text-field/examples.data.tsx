import TextField, {
    ITextFieldHandledProps,
    ITextFieldManagedClasses,
    ITextFieldUnhandledProps,
    TextFieldType
} from "./text-field";
import schema from "./text-field.schema.json";
import * as React from "react";
import Documentation from "./.tmp/documentation";
import { IComponentFactoryExample } from "@microsoft/fast-development-site-react";

const examples: IComponentFactoryExample<ITextFieldHandledProps & ITextFieldManagedClasses> = {
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
        },
        // Test deprecated values still work
        {
            managedClasses: {
                textField: "textfield"
            },
            type: TextFieldType.date
        },
        {
            managedClasses: {
                textField: "textfield"
            },
            type: TextFieldType.month
        },
        {
            managedClasses: {
                textField: "textfield"
            },
            type: TextFieldType.range
        },
        {
            managedClasses: {
                textField: "textfield"
            },
            type: TextFieldType.time
        },
        {
            managedClasses: {
                textField: "textfield"
            },
            type: TextFieldType.week
        }
    ]
};

export default examples;
