import { WebComponentDefinition } from "@microsoft/fast-tooling/dist/data-utilities/web-component";

export const fastOptionDefinition: WebComponentDefinition = {
    version: 1,
    tags: [
        {
            name: "fast-option",
            description: "The FAST option element",
            attributes: [],
            slots: [
                {
                    name: "",
                    description: "The default slot",
                },
            ],
        },
    ],
};
