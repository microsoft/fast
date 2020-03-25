import { customElement } from "@microsoft/fast-element";
import { MenuItem } from "./menu-item";
import { MenuItemTemplate as template } from "./menu-item.template";
import { MenuItemStyles as styles } from "./menu-item.styles";

@customElement({
    name: "fast-menu-item",
    template,
    styles,
})
export class FASTMenuItem extends MenuItem {}
export * from "./menu-item.template";
export * from "./menu-item.styles";
export * from "./menu-item";
