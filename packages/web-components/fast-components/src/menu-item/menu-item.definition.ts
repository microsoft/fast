import { WebComponentDefinition } from "@microsoft/fast-tooling/dist/esm/data-utilities/web-component";
import { DataType } from "@microsoft/fast-tooling";
import { MenuItemRole } from "@microsoft/fast-foundation/dist/esm/menu-item/menu-item.options";

export const fastMenuItemDefinition: WebComponentDefinition = {
    version: 1,
    tags: [
        {
            name: "fast-menu-item",
            title: "Menu item",
            description: "The FAST menu item element",
            attributes: [
                {
                    name: "disabled",
                    title: "Disabled",
                    type: DataType.boolean,
                    description: "Sets the disabled state of the item",
                    default: true,
                    required: false,
                },
                {
                    name: "expanded",
                    title: "Expanded",
                    type: DataType.boolean,
                    description: "The expanded state of the item",
                    default: true,
                    required: false,
                },
                {
                    name: "role",
                    title: "Role",
                    type: DataType.string,
                    description: "The ARIA role of the menu item",
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
                    title: "Checked",
                    type: DataType.boolean,
                    description:
                        "The checked state for elements with a role of menuitemradio or menuitemcheckbox",
                    default: true,
                    required: false,
                },
            ],
            slots: [
                {
                    name: "",
                    title: "Default slot",
                    description: "The content of the menu item",
                },
                {
                    name: "start",
                    title: "Start slot",
                    description:
                        "Contents of the start slot are positioned before the item content",
                },
                {
                    name: "end",
                    title: "End slot",
                    description:
                        "Contents of the end slot are positioned after the item content",
                },
            ],
        },
    ],
};
