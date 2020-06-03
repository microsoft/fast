import { WebComponentDefinition } from "@microsoft/fast-tooling/dist/data-utilities/web-component";

export const spanDefinition: WebComponentDefinition = {
    version: 1,
    tags: [
        {
            name: "span",
            description: "The span element",
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
