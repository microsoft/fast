import type { WebComponentDefinition } from "@microsoft/fast-tooling/dist/esm/data-utilities/web-component";
import { DataType } from "@microsoft/fast-tooling";
import { SelectPosition } from "@microsoft/fast-foundation/dist/esm/select/select.options";
import { ComboboxAutocomplete } from "@microsoft/fast-foundation/dist/esm/combobox/combobox.options";

export const fastComboboxDefinition: WebComponentDefinition = {
    version: 1,
    tags: [
        {
            name: "fast-combobox",
            title: "Combobox",
            description: "The FAST combobox element",
            attributes: [
                {
                    name: "autocomplete",
                    title: "Autocomplete",
                    description:
                        "Sets the autocomplete method to use when the combobox receives user input",
                    default: "",
                    type: DataType.string,
                    values: Object.keys(ComboboxAutocomplete).map(x => ({ name: x })),
                },
                {
                    name: "disabled",
                    title: "Disabled",
                    description: "Sets the disabled state of the combobox",
                    type: DataType.boolean,
                    default: false,
                    required: false,
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
                    name: "position",
                    title: "Position",
                    description: "Controls the placement of the combobox dropdown",
                    default: undefined,
                    required: false,
                    type: DataType.string,
                    values: Object.keys(SelectPosition).map(x => ({ name: x })),
                },
                {
                    name: "placeholder",
                    title: "Placeholder",
                    description:
                        "Sets the placeholder value of the combobox to provide a hint to the user",
                    required: false,
                    type: DataType.string,
                    default: undefined,
                },
                {
                    name: "value",
                    title: "Value",
                    description: "The initial value of the combobox",
                    default: undefined,
                    required: false,
                    type: DataType.string,
                },
            ],
            slots: [
                {
                    name: "",
                    title: "Default slot",
                    description:
                        "Supports fast-option, option elements, or elements with a role of option",
                },
                {
                    name: "control",
                    title: "Input Control slot",
                    description: "Slot to replace the contents of the control container",
                },
                {
                    name: "indicator",
                    title: "Indicator slot",
                    description:
                        "Slot to provide a custom icon to represent the visual indicator",
                },
                {
                    name: "start",
                    title: "Start slot",
                    description:
                        "Contents of the start slot are positioned before the contents of the control container",
                },
                {
                    name: "end",
                    title: "End slot",
                    description:
                        "Contents of the end slot are positioned after the contents of the control container",
                },
            ],
        },
    ],
};
