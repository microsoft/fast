import { WebComponentDefinition } from "@microsoft/fast-tooling/dist/esm/data-utilities/web-component";
import { DataType } from "@microsoft/fast-tooling";
import { Orientation } from "@microsoft/fast-web-utilities";

export const fastRadioGroupDefinition: WebComponentDefinition = {
    version: 1,
    tags: [
        {
            name: "fast-radio-group",
            title: "Radio group",
            description: "The FAST radio-group element",
            attributes: [
                {
                    name: "value",
                    title: "Value",
                    description: "The value of the radio group",
                    default: undefined,
                    required: false,
                    type: DataType.string,
                },
                {
                    name: "orientation",
                    title: "Value",
                    description: "The visual orientation of the group",
                    default: Orientation.horizontal,
                    values: [
                        { name: Orientation.horizontal },
                        { name: Orientation.vertical },
                    ],
                    required: false,
                    type: DataType.string,
                },
                {
                    name: "name",
                    title: "Name",
                    description:
                        "Setting this value will set the name value for all child radios",
                    type: DataType.string,
                    default: "",
                    required: false,
                },
                {
                    name: "disabled",
                    title: "Disabled",
                    description: "Disables the radio group and child radios",
                    type: DataType.boolean,
                    default: false,
                    required: false,
                },
                {
                    name: "readonly",
                    title: "Readonly",
                    description:
                        "When true, the child radios will be immutable by user interaction",
                    type: DataType.boolean,
                    default: false,
                    required: false,
                },
            ],
            slots: [
                {
                    name: "",
                    title: "Default slot",
                    description:
                        "Supports fast-radio elements or elements with a role of 'radio'",
                },
                {
                    name: "label",
                    title: "Label slot",
                    description: "The visual label for the group",
                },
            ],
        },
    ],
};
