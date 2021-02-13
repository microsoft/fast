import { WebComponentDefinition } from "@microsoft/fast-tooling/dist/esm/data-utilities/web-component";
import { DataType } from "@microsoft/fast-tooling";

export const fastProgressRingDefinition: WebComponentDefinition = {
    version: 1,
    tags: [
        {
            name: "fast-progress-ring",
            title: "Progress ring",
            description: "The FAST progress-ring element",
            attributes: [
                {
                    name: "value",
                    title: "Value",
                    description:
                        "Value between 1 and 100 to represent the progress visually and to assistive technologies",
                    default: "",
                    required: false,
                    type: DataType.number,
                },
                {
                    name: "min",
                    title: "Min",
                    description: "The minimum value",
                    default: 0,
                    required: false,
                    type: DataType.number,
                },
                {
                    name: "max",
                    title: "Max",
                    description: "The maximum value",
                    default: 100,
                    required: false,
                    type: DataType.number,
                },
                {
                    name: "paused",
                    title: "Paused",
                    description: "Sets the paused state of the progress component",
                    default: false,
                    required: false,
                    type: DataType.boolean,
                },
            ],
            slots: [
                {
                    name: "determinate",
                    title: "Determinate slot",
                    description:
                        "Slot to provide custom visual representations of the determinate progress ring",
                },
                {
                    name: "indeterminate",
                    title: "Indeterminate slot",
                    description:
                        "Slot to provide custom visual representations of the indeterminate progress ring",
                },
            ],
        },
    ],
};
