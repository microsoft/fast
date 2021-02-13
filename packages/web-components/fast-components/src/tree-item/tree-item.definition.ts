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
                    title: "Expanded",
                    description: "Indicates whether tree item is expanded or not",
                    default: false,
                    required: false,
                    type: DataType.boolean,
                },
                {
                    name: "selected",
                    title: "Selected",
                    description: "Indicates if tree item is currently selected",
                    default: false,
                    required: false,
                    type: DataType.boolean,
                },
                {
                    name: "disabled",
                    title: "Disabled",
                    description: "Sets the disabled state of the tree item",
                    type: DataType.boolean,
                    default: false,
                    required: false,
                },
            ],
            slots: [
                {
                    name: "",
                    title: "Default slot",
                    description: "The visual label of the tree item",
                },
                {
                    name: "item",
                    title: "Item slot",
                    description:
                        "Nested fast-tree-item elements automatically apply a slot of item for an intuitive API",
                },
                {
                    name: "expand-collapse-glyph",
                    title: "Expand collapse glyph slot",
                    description:
                        "Slot to provide a custom visual to represent the expanded and collapsed states",
                },
                {
                    name: "start",
                    title: "Start slot",
                    description:
                        "Contents of the start slot are positioned after the expand/collapse glyph and before the item content",
                },
                {
                    name: "end",
                    title: "End slot",
                    description:
                        "Contents of the end slot are positioned after the item content",
                },
            ],
        },
    ],
};
