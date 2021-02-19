import { WebComponentDefinition } from "@microsoft/fast-tooling/dist/esm/data-utilities/web-component";
import { DataType } from "@microsoft/fast-tooling";

export const fastSkeletonDefinitions: WebComponentDefinition = {
    version: 1,
    tags: [
        {
            name: "fast-skeleton",
            title: "Skeleton",
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
                    title: "Default slot",
                    description:
                        "The default slot can be used to optionally include inline SVG's rather than a pattern",
                },
            ],
        },
    ],
};
