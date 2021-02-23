import { WebComponentDefinition } from "@microsoft/fast-tooling/dist/esm/data-utilities/web-component";
import { DataType } from "@microsoft/fast-tooling";

export const fastBreadcrumbDefinition: WebComponentDefinition = {
    version: 1,
    tags: [
        {
            name: "fast-breadcrumb",
            title: "Breadcrumb",
            description: "The FAST breadcrumb element",
            attributes: [],
            slots: [
                {
                    name: "",
                    title: "Default slot",
                    description:
                        "The content of the breadcrumb, typically composed of fast-breadcrumb-items or anchors",
                },
            ],
        },
    ],
};
