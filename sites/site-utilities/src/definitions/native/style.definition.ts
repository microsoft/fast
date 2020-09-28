import { WebComponentDefinition } from "@microsoft/fast-tooling/dist/data-utilities/web-component";

export const styleDefinition: WebComponentDefinition = {
    version: 1,
    tags: [
        {
            name: "style",
            description: "The style element",
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
