import { WebComponentDefinition } from "@microsoft/fast-tooling/dist/esm/data-utilities/web-component";
import { DataType } from "@microsoft/fast-tooling";

export const fastRadioDefinition: WebComponentDefinition = {
    version: 1,
    tags: [
        {
            name: "fast-radio",
            title: "Radio",
            description: "The FAST radio element",
            attributes: [
                {
                    name: "checked",
                    description: "The checked attribute",
                    default: undefined,
                    required: false,
                    type: DataType.boolean,
                },
                {
                    name: "name",
                    description: "The name attribute",
                    type: DataType.string,
                    default: "",
                    required: false,
                },
                {
                    name: "required",
                    description: "The required attribute",
                    type: DataType.boolean,
                    default: false,
                    required: false,
                },
                {
                    name: "disabled",
                    description: "The disabled attribute",
                    type: DataType.boolean,
                    default: false,
                    required: false,
                },
                {
                    name: "readonly",
                    description: "The readonly attribute",
                    type: DataType.boolean,
                    default: false,
                    required: false,
                },
            ],
            slots: [
                {
                    name: "",
                    title: "Default slot",
                    description: "The content of the radio represents its visual label",
                },
                {
                    name: "checked-indicator",
                    title: "Checked indicator slot",
                    description:
                        "Slot to provide a custom icon to represent the checked state",
                },
            ],
        },
    ],
};
