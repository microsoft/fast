import { WebComponentDefinition } from "@microsoft/fast-tooling/dist/data-utilities/web-component";

export const fastCardDefinition: WebComponentDefinition = {
    version: 1,
    tags: [
        {
            name: "fast-card",
            description: "The FAST card element",
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
