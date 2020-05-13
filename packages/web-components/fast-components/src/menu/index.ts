import { customElement } from "@microsoft/fast-element";
import { Menu } from "./menu";
import { MenuTemplate as template } from "./menu.template";
import { MenuStyles as styles } from "./menu.styles";

@customElement({
    name: "fast-menu",
    template,
    styles,
})
export class FASTMenu extends Menu {}
export * from "./menu.template";
export * from "./menu.styles";
export * from "./menu";
