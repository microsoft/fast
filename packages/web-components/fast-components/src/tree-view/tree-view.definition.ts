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
                    name: "name",
                    description: "The name attribute",
                    type: DataType.string,
                    default: "",
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
