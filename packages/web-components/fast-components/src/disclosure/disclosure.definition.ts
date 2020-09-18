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
                    name: "transitioning",
                    description: "The transitioning attribute",
                    type: DataType.boolean,
                    default: false,
                    required: false,
                },
            ],
            slots: [
                {
                    name: "invoker",
                    description: "The invoker slot",
                },
                {
                    name: "",
                    description: "The content slot",
                },
            ],
        },
    ],
};
