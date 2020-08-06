import { WebComponentDefinition } from "@microsoft/fast-tooling/dist/data-utilities/web-component";

export const fastMenuDefinition: WebComponentDefinition = {
    version: 1,
    tags: [
        {
            name: "fast-menu",
            description: "The FAST menu element",
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
