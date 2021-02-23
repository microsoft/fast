import { WebComponentDefinition } from "@microsoft/fast-tooling/dist/esm/data-utilities/web-component";
import { DataType } from "@microsoft/fast-tooling";

export const fastTreeViewDefinition: WebComponentDefinition = {
    version: 1,
    tags: [
        {
            name: "fast-tree-view",
            title: "Tree view",
            description: "The FAST tree view element",
            attributes: [
                {
                    name: "render-collapsed-nodes",
                    title: "Render collapsed nodes",
                    description:
                        "Determines whether the tree should render nodes under collapsed items",
                    type: DataType.boolean,
                    default: undefined,
                    required: false,
                },
            ],
            slots: [
                {
                    name: "",
                    title: "Default slot",
                    description:
                        "Supports fast-tree-item elements or elements with a role of 'treeitem'",
                },
            ],
        },
    ],
};
