import { WebComponentDefinition } from "@microsoft/fast-tooling/dist/data-utilities/web-component";
import { DataType } from "@microsoft/fast-tooling";

export const fastBreadcrumbDefinition: WebComponentDefinition = {
    version: 1,
    tags: [
        {
            name: "fast-breadcrumb",
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
                    description: "The default slot",
                },
            ],
        },
    ],
};
