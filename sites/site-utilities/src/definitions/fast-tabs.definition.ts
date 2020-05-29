import { WebComponentDefinition } from "@microsoft/fast-tooling/dist/data-utilities/web-component";
import { Orientation } from "@microsoft/fast-web-utilities";
import { DataType } from "@microsoft/fast-tooling";

export const fastTabsDefinition: WebComponentDefinition = {
    version: 1,
    tags: [
        {
            name: "fast-tabs",
            description: "The FAST tabs element",
            attributes: [
                {
                    name: "orientation",
                    description: "The orientation attribute",
                    default: Orientation.horizontal,
                    required: false,
                    type: DataType.string,
                    enum: [Orientation.horizontal, Orientation.vertical],
                },
                {
                    name: "activeid",
                    description: "The activeid attribute",
                    default: undefined,
                    required: false,
                    type: DataType.string,
                },
            ],
            slots: [
                {
                    name: "tab",
                    description: "The tab slot",
                },
                {
                    name: "tabpanel",
                    description: "The tabpanel slot",
                },
            ],
        },
    ],
};
