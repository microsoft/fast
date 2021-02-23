import { WebComponentDefinition } from "@microsoft/fast-tooling/dist/esm/data-utilities/web-component";
import { DataType } from "@microsoft/fast-tooling";

export const fastSwitchDefinition: WebComponentDefinition = {
    version: 1,
    tags: [
        {
            name: "fast-switch",
            title: "Switch",
            description: "The FAST switch element",
            attributes: [
                {
                    title: "Checked",
                    description: "Provides the default checked value",
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
                    description: "Sets the disabled state of the switch",
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
                    description: "The content of the switch represents its visual label",
                },
                {
                    name: "checked-message",
                    title: "Checked message slot",
                    description: "Visible content representing the checked state",
                },
                {
                    name: "unchecked-message",
                    title: "Unchecked message slot",
                    description: "Visible content representing the unchecked state",
                },
            ],
        },
    ],
};
