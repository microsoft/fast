import { WebComponentDefinition } from "@microsoft/fast-tooling/dist/esm/data-utilities/web-component";
import { DataType } from "@microsoft/fast-tooling";
import { DividerRole } from "@microsoft/fast-foundation/dist/esm/divider/divider.options";

export const fastDividerDefinition: WebComponentDefinition = {
    version: 1,
    tags: [
        {
            name: "fast-divider",
            title: "Divider",
            description: "The FAST divider element",
            attributes: [
                {
                    name: "role",
                    title: "Role",
                    type: DataType.string,
                    description: "The ARIA role for the divider",
                    values: [
                        {
                            name: DividerRole.separator,
                        },
                        {
                            name: DividerRole.presentation,
                        },
                    ],
                    default: DividerRole.separator,
                    required: false,
                },
            ],
            slots: [],
        },
    ],
};
