import { WebComponentDefinition } from "@microsoft/fast-tooling/dist/data-utilities/web-component";

export const labelDefinition: WebComponentDefinition = {
    version: 1,
    tags: [
        {
            name: "label",
            description: "The label element",
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
