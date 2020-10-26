import { WebComponentDefinition } from "@microsoft/fast-tooling/dist/data-utilities/web-component";

export const fastListboxDefinition: WebComponentDefinition = {
    version: 1,
    tags: [
        {
            name: "fast-listbox",
            description: "The FAST listbox element",
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
