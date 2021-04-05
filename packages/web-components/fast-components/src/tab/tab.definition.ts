import type { WebComponentDefinition } from "@microsoft/fast-tooling/dist/esm/data-utilities/web-component";

export const fastTabDefinition: WebComponentDefinition = {
    version: 1,
    tags: [
        {
            name: "fast-tab",
            title: "Tab",
            description: "The FAST tab element",
            attributes: [],
            slots: [
                {
                    name: "",
                    title: "Default slot",
                },
            ],
        },
    ],
};
