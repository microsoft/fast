import { WebComponentDefinition } from "@microsoft/fast-tooling/dist/data-utilities/web-component";
import { DataType } from "@microsoft/fast-tooling";

export const fastTreeItemDefinition: WebComponentDefinition = {
    version: 1,
    tags: [
        {
            name: "fast-tree-item",
            description: "The FAST tree item element",
            attributes: [
                {
                    name: "expanded",
                    description: "Indicates whether tree item is expanded or not",
                    default: false,
                    required: false,
                    type: DataType.number,
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
                    description: "The default slot used for content",
                },
                {
                    name: "expand-collapse-glyph",
                    description: "glyph indicating whether tree item is expanded or not",
                },
                {
                    name: "before-content",
                    description: "DOM to be inserted before tree item content",
                },
                {
                    name: "after-content",
                    description: "DOM to be inserted after tree item content",
                },
            ],
        },
    ],
};
