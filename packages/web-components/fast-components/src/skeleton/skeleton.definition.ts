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
                    title: "Fill",
                    description: "Indicates the Skeleton should have a filled style",
                    type: DataType.string,
                    default: undefined,
                    required: false,
                },
                {
                    name: "shape",
                    title: "Shape",
                    description: "The shape of the Skeleton",
                    type: DataType.string,
                    default: "rect",
                    values: [{ name: "rect" }, { name: "circle" }],
                    required: false,
                },
                {
                    name: "pattern",
                    title: "Pattern",
                    description:
                        "Allows a reference to a hosted asset to be used rather than an inline SVG",
                    type: DataType.string,
                    default: undefined,
                    required: false,
                },
                {
                    name: "shimmer",
                    description:
                        "Indicates that the component has an activated shimmer effect",
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
