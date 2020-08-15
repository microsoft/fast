import { WebComponentDefinition } from "@microsoft/fast-tooling/dist/data-utilities/web-component";
import { DataType } from "@microsoft/fast-tooling";

export const fastFlipperDefinition: WebComponentDefinition = {
    version: 1,
    tags: [
        {
            name: "fast-flipper",
            description: "The FAST flipper element",
            attributes: [
                {
                    name: "disabled",
                    type: DataType.boolean,
                    description: "The disabled attribute",
                    default: true,
                    required: false,
                },
                {
                    name: "aria-hidden",
                    type: DataType.boolean,
                    description: "The aria-hidden attribute",
                    default: true,
                    required: false,
                },
                {
                    name: "direction",
                    type: DataType.boolean,
                    description: "The direction attribute",
                    values: [
                        {
                            name: "previous",
                        },
                        {
                            name: "next",
                        },
                    ],
                    default: "next",
                    required: false,
                },
            ],
            slots: [
                {
                    name: "previous",
                    description: "The previous slot",
                },
                {
                    name: "next",
                    description: "The next slot",
                },
            ],
        },
    ],
};
