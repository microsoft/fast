import { WebComponentDefinition } from "@microsoft/fast-tooling/dist/esm/data-utilities/web-component";
import { Orientation } from "@microsoft/fast-web-utilities";
import { DataType } from "@microsoft/fast-tooling";

export const fastTabsDefinition: WebComponentDefinition = {
    version: 1,
    tags: [
        {
            name: "fast-tabs",
            title: "Tabs",
            description: "The FAST tabs element",
            attributes: [
                {
                    name: "orientation",
                    title: "Orientation",
                    description: "The orientation of the tabs",
                    default: Orientation.horizontal,
                    required: false,
                    type: DataType.string,
                    values: [
                        { name: Orientation.horizontal },
                        { name: Orientation.vertical },
                    ],
                },
                {
                    name: "activeid",
                    title: "Active id",
                    description: "The HTML id of the active tab",
                    default: undefined,
                    required: false,
                    type: DataType.string,
                },
            ],
            slots: [
                {
                    name: "tab",
                    title: "Tab slot",
                    description:
                        "Slotted tabs are rendered and associated to their respective tab panel by their order in the DOM",
                },
                {
                    name: "tabpanel",
                    title: "Tabpanel slot",
                    description:
                        "Slotted tab panels are rendered and associated to their respective tabs by their order in the DOM",
                },
                {
                    name: "start",
                    title: "Start slot",
                    description:
                        "Contents of the start slot are positioned before the tablist",
                },
                {
                    name: "end",
                    title: "End slot",
                    description:
                        "Contents of the end slot are positioned after the tablist",
                },
            ],
        },
    ],
};
