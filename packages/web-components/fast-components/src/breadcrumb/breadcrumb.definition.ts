import { WebComponentDefinition } from "@microsoft/fast-tooling/dist/esm/data-utilities/web-component";
import { DataType } from "@microsoft/fast-tooling";

export const fastBreadcrumbDefinition: WebComponentDefinition = {
    version: 1,
    tags: [
        {
            name: "fast-breadcrumb",
            title: "Breadcrumb",
            description: "The FAST breadcrumb element",
            attributes: [
                {
                    name: "separator",
                    description: "The separator attribute",
                    type: DataType.string,
                    default: "/",
                    required: false,
                },
            ],
            slots: [
                {
                    name: "",
                    description: "Default slot",
                },
            ],
        },
    ],
};
