import { WebComponentDefinition } from "@microsoft/fast-tooling/dist/esm/data-utilities/web-component";

export const fastTabPanelDefinition: WebComponentDefinition = {
    version: 1,
    tags: [
        {
            name: "fast-tab-panel",
            description: "The FAST tab-panel element",
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
