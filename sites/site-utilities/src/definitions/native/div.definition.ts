import { WebComponentDefinition } from "@microsoft/fast-tooling/dist/data-utilities/web-component";

export const divDefinition: WebComponentDefinition = {
    version: 1,
    tags: [
        {
            name: "div",
            description: "The div element",
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
