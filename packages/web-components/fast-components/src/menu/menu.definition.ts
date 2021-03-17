import type { WebComponentDefinition } from "@microsoft/fast-tooling/dist/esm/data-utilities/web-component";

export const fastMenuDefinition: WebComponentDefinition = {
    version: 1,
    tags: [
        {
            name: "fast-menu",
            title: "Menu",
            description: "The FAST menu element",
            attributes: [],
            slots: [
                {
                    name: "",
                    title: "Default slot",
                    description:
                        "Supports fast-menu-item elements or elements with a role of 'menuitem', 'menuitemcheckbox', and 'menuitemradio'",
                },
            ],
        },
    ],
};
