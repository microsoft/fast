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
                    title: "Checked",
                    description:
                        "Provides the default checked value of the form associated input element",
                    default: undefined,
                    required: false,
                    type: DataType.boolean,
                },
                {
                    name: "name",
                    title: "Name",
                    description:
                        "This element's value will be surfaced during form submission under the provided name",
                    type: DataType.string,
                    default: "",
                    required: false,
                },
                {
                    name: "required",
                    title: "Required",
                    description:
                        "Require the field to be completed prior to form submission",
                    type: DataType.boolean,
                    default: false,
                    required: false,
                },
                {
                    name: "disabled",
                    title: "Disabled",
                    description: "Sets the disabled state of the radio",
                    type: DataType.boolean,
                    default: false,
                    required: false,
                },
                {
                    name: "readonly",
                    title: "Readonly",
                    description:
                        "When true, the control will be immutable by user interaction",
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
