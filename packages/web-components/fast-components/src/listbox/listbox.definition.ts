import { WebComponentDefinition } from "@microsoft/fast-tooling/dist/esm/data-utilities/web-component";
import { ListboxRole } from "@microsoft/fast-foundation/dist/esm/listbox/listbox.options";
import { DataType } from "@microsoft/fast-tooling";

export const fastListboxDefinition: WebComponentDefinition = {
    version: 1,
    tags: [
        {
            name: "fast-listbox",
            title: "Listbox",
            description: "The FAST listbox element",
            attributes: [
                {
                    name: "role",
                    title: "Role",
                    description: "The ARIA role for the listbox",
                    type: DataType.string,
                    default: ListboxRole.listbox,
                    required: true,
                    values: Object.keys(ListboxRole).map(e => ({ name: `${e}` })),
                },
                {
                    name: "disabled",
                    title: "Disabled",
                    description: "Sets the disabled state of the listbox",
                    type: DataType.boolean,
                    default: false,
                    required: false,
                },
            ],
            slots: [
                {
                    name: "",
                    title: "Default slot",
                    description: "Supports fast-option or option elements",
                },
            ],
        },
    ],
};
