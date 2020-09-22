import { WebComponentDefinition } from "@microsoft/fast-tooling/dist/data-utilities/web-component";
import { DataType } from "@microsoft/fast-tooling";

export const fastBadgeDefinition: WebComponentDefinition = {
    version: 1,
    tags: [
        {
            name: "fast-badge",
            description: "The FAST badge element",
            attributes: [
                {
                    name: "circular",
                    description: "The circular attribute",
                    type: DataType.boolean,
                    default: false,
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
