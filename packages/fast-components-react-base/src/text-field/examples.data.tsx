import TextField, {
    TextFieldHandledProps,
    TextFieldManagedClasses,
    TextFieldType,
    TextFieldUnhandledProps,
} from "./text-field";
import { textFieldSchema } from "../index";
import React from "react";
import Documentation from "./.tmp/documentation";
import { ComponentFactoryExample } from "@microsoft/fast-development-site-react";

const examples: ComponentFactoryExample<TextFieldHandledProps> = {
    name: "Text field",
    component: TextField,
    schema: textFieldSchema as any,
    documentation: <Documentation />,
    detailData: {
        managedClasses: {
            textField: "textfield",
        },
        type: TextFieldType.text,
    },
    data: [
        {
            managedClasses: {
                textField: "textfield",
            },
            type: TextFieldType.text,
        },
        {
            managedClasses: {
                textField: "textfield",
            },
            type: TextFieldType.email,
        },
        {
            managedClasses: {
                textField: "textfield",
            },
            type: TextFieldType.number,
        },
        {
            managedClasses: {
                textField: "textfield",
            },
            type: TextFieldType.tel,
        },
    ],
};

export default examples;
