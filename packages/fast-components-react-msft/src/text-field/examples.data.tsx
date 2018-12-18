import React from "react";
import { ComponentFactoryExample } from "@microsoft/fast-development-site-react";
import { TextField, TextFieldProps, TextFieldType } from "./index";
import schema from "@microsoft/fast-components-react-base/dist/text-field/text-field.schema.json";
import Documentation from "./.tmp/documentation";

export default {
    name: "Text field",
    component: TextField,
    schema: schema as any,
    documentation: <Documentation />,
    detailData: {
        type: TextFieldType.email,
        placeholder: "name@email.com",
    },
    data: [
        {
            placeholder: "Placeholder",
            type: TextFieldType.text,
        },
        {
            type: TextFieldType.email,
            defaultValue: "name@email.com",
        },
        {
            type: TextFieldType.number,
            defaultValue: "12345",
        },
        {
            type: TextFieldType.tel,
            defaultValue: "(201) 867-5309",
        },
        {
            disabled: true,
            type: TextFieldType.text,
            defaultValue: "Disabled",
        },
        {
            disabled: true,
            type: TextFieldType.text,
            placeholder: "Disabled placeholder",
        },
        {
            placeholder: "Enter Password",
            type: TextFieldType.password,
        },
    ],
} as ComponentFactoryExample<TextFieldProps>;
