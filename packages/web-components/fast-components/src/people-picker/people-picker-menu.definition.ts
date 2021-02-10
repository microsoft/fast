import { WebComponentDefinition } from "@microsoft/fast-tooling/dist/esm/data-utilities/web-component";
import { DataType } from "@microsoft/fast-tooling";

export const fastPeoplePickerMenuDefinition: WebComponentDefinition = {
    version: 1,
    tags: [
        {
            name: "fast-people-picker-menu",
            description: "The FAST people-picker-menu element",
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
