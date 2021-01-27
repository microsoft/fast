import { WebComponentDefinition } from "@microsoft/fast-tooling/dist/esm/data-utilities/web-component";
import { DataType } from "@microsoft/fast-tooling";
import { MenuItemRole } from "@microsoft/fast-foundation/dist/esm/menu-item/menu-item.options";

export const fastMenuItemDefinition: WebComponentDefinition = {
    version: 1,
    tags: [
        {
            name: "fast-menu-item",
            description: "The FAST menu item element",
            attributes: [
                {
                    name: "disabled",
                    type: DataType.boolean,
                    description: "The disabled attribute",
                    default: true,
                    required: false,
                },
                {
                    name: "expanded",
                    type: DataType.boolean,
                    description: "The expanded attribute",
                    default: true,
                    required: false,
                },
                {
                    name: "role",
                    type: DataType.string,
                    description: "The role attribute",
                    default: MenuItemRole.menuitem,
                    values: [
                        { name: MenuItemRole.menuitem },
                        { name: MenuItemRole.menuitemcheckbox },
                        { name: MenuItemRole.menuitemradio },
                    ],
                    required: false,
                },
                {
                    name: "checked",
                    type: DataType.boolean,
                    description: "The checked attribute",
                    default: true,
                    required: false,
                },
            ],
            slots: [
                {
                    name: "",
                    description: "The default slot",
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
