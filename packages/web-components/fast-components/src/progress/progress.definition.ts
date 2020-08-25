import { WebComponentDefinition } from "@microsoft/fast-tooling/dist/data-utilities/web-component";
import { DataType } from "@microsoft/fast-tooling";

export const fastProgressDefinition: WebComponentDefinition = {
    version: 1,
    tags: [
        {
            name: "fast-progress",
            description: "The FAST progress element",
            attributes: [
                {
                    name: "value",
                    description: "The value attribute",
                    default: "",
                    required: false,
                    type: DataType.number,
                },
                {
                    name: "min",
                    description: "The min attribute",
                    default: 0,
                    required: false,
                    type: DataType.number,
                },
                {
                    name: "max",
                    description: "The max attribute",
                    default: 100,
                    required: false,
                    type: DataType.number,
                },
                {
                    name: "paused",
                    description: "The paused attribute",
                    default: false,
                    required: false,
                    type: DataType.boolean,
                },
            ],
            slots: [
                {
                    name: "determinate",
                    description: "The determinate slot",
                },
                {
                    name: "indeterminate",
                    description: "The indeterminate slot",
                },
            ],
        },
    ],
};
