import { WebComponentDefinition } from "@microsoft/fast-tooling/dist/data-utilities/web-component";
import { DataType } from "@microsoft/fast-tooling";

export const fastAvatarDefinition: WebComponentDefinition = {
    version: 1,
    tags: [
        {
            name: "fast-avatar",
            description: "The FAST avatar element",
            attributes: [
                {
                    name: "initials",
                    description: "The initials attribute",
                    type: DataType.string,
                    default: undefined,
                    required: false,
                },
                {
                    name: "fill",
                    description: "The fill attribute",
                    type: DataType.string,
                    default: undefined,
                    required: false,
                },
                {
                    name: "color",
                    description: "The color attribute",
                    type: DataType.string,
                    default: undefined,
                    required: false,
                },
                {
                    name: "alt",
                    description: "The alt attribute",
                    type: DataType.string,
                    default: undefined,
                    required: false,
                },
                {
                    name: "link",
                    description: "The link attribute",
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
            ],
            slots: [
                {
                    name: "badge",
                    description: "The badge slot",
                },
            ],
        },
    ],
};
