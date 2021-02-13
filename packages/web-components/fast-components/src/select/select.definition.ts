import { WebComponentDefinition } from "@microsoft/fast-tooling/dist/esm/data-utilities/web-component";
import { DataType } from "@microsoft/fast-tooling";
import { SelectPosition } from "@microsoft/fast-foundation/dist/esm/select/select.options";

export const fastSelectDefinition: WebComponentDefinition = {
    version: 1,
    tags: [
        {
            name: "fast-select",
            title: "Select",
            description: "The FAST select element",
            attributes: [
                {
                    name: "disabled",
                    description: "The disabled attribute",
                    type: DataType.boolean,
                    default: false,
                    required: false,
                },
                {
                    name: "name",
                    description: "The name attribute",
                    type: DataType.string,
                    default: "",
                    required: false,
                },
                {
                    name: "position",
                    description: "The position attribute",
                    default: undefined,
                    required: false,
                    type: DataType.string,
                    values: Object.keys(SelectPosition).map(x => ({ name: x })),
                },
            ],
            slots: [
                {
                    name: "",
                    title: "Default slot",
                    description: "Supports fast-option or option elements",
                },
                {
                    name: "button-container",
                    title: "Button container slot",
                    description:
                        "Slot to replace the entire invoking element and its contents",
                },
                {
                    name: "selected-value",
                    title: "Selected value slot",
                    description: "Slot to replace the displayed value contents",
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
                        "Contents of the start slot are positioned before the button container",
                },
                {
                    name: "end",
                    title: "End slot",
                    description:
                        "Contents of the end slot are positioned after the button container and after the indicator",
                },
            ],
        },
    ],
};
