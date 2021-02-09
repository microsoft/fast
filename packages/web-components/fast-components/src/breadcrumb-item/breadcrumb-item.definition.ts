import { WebComponentDefinition } from "@microsoft/fast-tooling/dist/esm/data-utilities/web-component";
import { DataType } from "@microsoft/fast-tooling";

export const fastBreadcrumbItemDefinition: WebComponentDefinition = {
    version: 1,
    tags: [
        {
            name: "fast-breadcrumb-item",
            description: "The FAST breadcrumb item element",
            attributes: [
                {
                    name: "href",
                    description: "The href attribute",
                    type: DataType.string,
                    default: "",
                    required: false,
                },
            ],
            slots: [
                {
                    name: "",
                    description: "The default slot",
                },
                {
                    name: "separator",
                    description: "The separator slot",
                },
                {
                    name: "start",
                    description: "The start slot",
                },
                {
                    name: "end",
                    description: "The end slot",
                },
            ],
        },
    ],
};
