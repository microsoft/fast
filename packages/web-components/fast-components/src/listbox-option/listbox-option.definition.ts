import { WebComponentDefinition } from "@microsoft/fast-tooling/dist/esm/data-utilities/web-component";
import { DataType } from "@microsoft/fast-tooling";

export const fastOptionDefinition: WebComponentDefinition = {
    version: 1,
    tags: [
        {
            name: "fast-option",
            description: "The FAST option element",
            attributes: [
                {
                    name: "disabled",
                    type: DataType.boolean,
                    description: "The disabled attribute",
                    default: false,
                    required: false,
                },
                {
                    name: "selected",
                    type: DataType.boolean,
                    description: "The selected attribute",
                    default: false,
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
