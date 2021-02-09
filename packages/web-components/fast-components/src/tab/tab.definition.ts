import { WebComponentDefinition } from "@microsoft/fast-tooling/dist/esm/data-utilities/web-component";

export const fastTabDefinition: WebComponentDefinition = {
    version: 1,
    tags: [
        {
            name: "fast-tab",
            description: "The FAST tab element",
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
