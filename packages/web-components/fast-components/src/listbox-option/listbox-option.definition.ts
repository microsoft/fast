import { WebComponentDefinition } from "@microsoft/fast-tooling/dist/data-utilities/web-component";
import { DataType } from "@microsoft/fast-tooling";
import { ListboxOptionRole } from "@microsoft/fast-foundation/dist/esm/listbox-option/listbox-option.options";

export const fastOptionDefinition: WebComponentDefinition = {
    version: 1,
    tags: [
        {
            name: "fast-option",
            description: "The FAST option element",
            attributes: [
                {
                    name: "disabled",
                    type: DataType.boolean,
                    description: "The disabled attribute",
                    default: false,
                    required: false,
                },
                {
                    name: "selected",
                    type: DataType.boolean,
                    description: "The selected attribute",
                    default: false,
                    required: false,
                },
                {
                    name: "role",
                    type: DataType.string,
                    description: "The role attribute",
                    default: ListboxOptionRole.option,
                    required: false,
                    values: [{ name: ListboxOptionRole.option }],
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
