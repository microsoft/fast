import { WebComponentDefinition } from "@microsoft/fast-tooling/dist/esm/data-utilities/web-component";
import { DataType } from "@microsoft/fast-tooling";

export const fastTreeItemDefinition: WebComponentDefinition = {
    version: 1,
    tags: [
        {
            name: "fast-tree-item",
            title: "Tree item",
            description: "The FAST tree item element",
            attributes: [
                {
                    name: "expanded",
                    description: "Indicates whether tree item is expanded or not",
                    default: false,
                    required: false,
                    type: DataType.boolean,
                },
                {
                    name: "selected",
                    description: "Indicates if tree item is currently selected",
                    default: false,
                    required: false,
                    type: DataType.boolean,
                },
                {
                    name: "disabled",
                    description: "The disabled attribute",
                    type: DataType.boolean,
                    default: false,
                    required: false,
                },
            ],
            slots: [
                {
                    name: "",
                    description: "Default slot",
                },
                {
                    name: "item",
                    description: "Item slot",
                },
                {
                    name: "expand-collapse-glyph",
                    description: "Expand collapse glyph slot",
                },
                {
                    name: "start",
                    description: "Start slot",
                },
                {
                    name: "end",
                    description: "End slot",
                },
            ],
        },
    ],
};
