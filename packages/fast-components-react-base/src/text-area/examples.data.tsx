import TextArea, {
    TextAreaHandledProps,
    TextAreaManagedClasses,
    TextAreaUnhandledProps,
} from "./text-area";
import schema from "./text-area.schema.json";
import React from "react";
import Documentation from "./.tmp/documentation";
import { ComponentFactoryExample } from "@microsoft/fast-development-site-react";

const managedClasses: TextAreaManagedClasses = {
    managedClasses: {
        textArea: "text-area",
    },
};

const examples: ComponentFactoryExample<TextAreaHandledProps> = {
    name: "Text area",
    component: TextArea,
    schema: schema as any,
    documentation: <Documentation />,
    detailData: {
        ...managedClasses,
        placeholder: "Text area placeholder text",
    },
    data: [
        {
            ...managedClasses,
        },
        {
            ...managedClasses,
            placeholder: "Placeholder text",
        },
        {
            ...managedClasses,
            disabled: true,
            placeholder: "Disabled",
        },
    ],
};

export default examples;
