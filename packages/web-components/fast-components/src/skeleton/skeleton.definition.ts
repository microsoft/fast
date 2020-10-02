import { WebComponentDefinition } from "@microsoft/fast-tooling/dist/data-utilities/web-component";
import { DataType } from "@microsoft/fast-tooling";

export const fastSkeletonDefinitions: WebComponentDefinition = {
    version: 1,
    tags: [
        {
            name: "fast-skeleton",
            description: "The FAST skeleton element",
            attributes: [
                {
                    name: "fill",
                    description: "The fill attribute",
                    type: DataType.string,
                    default: undefined,
                    required: false,
                },
                {
                    name: "shape",
                    description: "The shape attribute",
                    type: DataType.string,
                    default: "circle",
                    required: false,
                },
                {
                    name: "pattern",
                    description: "The pattern attribute",
                    type: DataType.string,
                    default: undefined,
                    required: false,
                },
                {
                    name: "shimmer",
                    description: "The shimmer attribute",
                    type: DataType.boolean,
                    default: undefined,
                    required: false,
                },
            ],
            slots: [
                {
                    name: "",
                    description: "The default slot",
                },
            ],
        },
    ],
};
