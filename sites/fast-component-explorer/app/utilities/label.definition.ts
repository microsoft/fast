import { WebComponentDefinition } from "@microsoft/fast-tooling/dist/data-utilities/web-component";

export const labelId = "label";
export const labelDefinition: WebComponentDefinition = {
    version: 1,
    tags: [
        {
            name: labelId,
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
