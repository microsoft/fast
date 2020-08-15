import { WebComponentDefinition } from "@microsoft/fast-tooling/dist/data-utilities/web-component";
import { DataType } from "@microsoft/fast-tooling";

export const fastDividerDefinition: WebComponentDefinition = {
    version: 1,
    tags: [
        {
            name: "fast-divider",
            description: "The FAST divider element",
            attributes: [
                {
                    name: "role",
                    type: DataType.string,
                    description: "The role attribute",
                    values: [
                        {
                            name: "separator",
                        },
                        {
                            name: "presentation",
                        },
                    ],
                    default: "separator",
                    required: false,
                },
            ],
            slots: [],
        },
    ],
};
