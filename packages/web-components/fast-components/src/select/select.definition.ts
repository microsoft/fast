import { WebComponentDefinition } from "@microsoft/fast-tooling/dist/data-utilities/web-component";

export const fastSelectDefinition: WebComponentDefinition = {
    version: 1,
    tags: [
        {
            name: "fast-select",
            description: "The FAST select element",
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
