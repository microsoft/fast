import { WebComponentDefinition } from "@microsoft/fast-tooling/dist/data-utilities/web-component";
import { DataType } from "@microsoft/fast-tooling";

export const fastDisclosureDefinition: WebComponentDefinition = {
    version: 1,
    tags: [
        {
            name: "fast-disclosure",
            description: "The FAST disclosure element",
            attributes: [
                {
                    name: "expanded",
                    description: "The opened attribute",
                    type: DataType.boolean,
                    default: false,
                    required: false,
                },
                {
                    name: "title",
                    description: "Invoker title attribute",
                    type: DataType.string,
                    default: false,
                    required: false,
                },
                {
                    name: "appearance",
                    description: "The appearance attribute",
                    type: DataType.string,
                    values: [
                        {
                            name: "accent",
                        },
                        {
                            name: "hypertext",
                        },
                    ],
                    default: "accent",
                    required: false,
                },
            ],
            slots: [
                {
                    name: "start",
                    description: "The start slot",
                },
                {
                    name: "title",
                    description: "The title slot",
                },
                {
                    name: "end",
                    description: "The end slot",
                },
                {
                    name: "",
                    description: "The content slot",
                },
            ],
        },
    ],
};
