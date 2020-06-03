import { WebComponentDefinition } from "@microsoft/fast-tooling/dist/data-utilities/web-component";

export const paragraphDefinition: WebComponentDefinition = {
    version: 1,
    tags: [
        {
            name: "p",
            description: "The paragraph element",
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
