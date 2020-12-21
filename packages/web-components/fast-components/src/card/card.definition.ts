import { WebComponentDefinition } from "@microsoft/fast-tooling/dist/data-utilities/web-component";
import { DataType } from "@microsoft/fast-tooling";

export const fastCardDefinition: WebComponentDefinition = {
    version: 1,
    tags: [
        {
            name: "fast-card",
            description: "The FAST card element",
            attributes: [
                {
                    name: "background-color",
                    description: "The background color attribute",
                    type: DataType.string,
                    default: "",
                    required: false,
                },
                {
                    name: "card-background-color",
                    description: "The card background color attribute",
                    type: DataType.string,
                    default: "",
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
