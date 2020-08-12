import { customElement } from "@microsoft/fast-element";
import { NavigationItem } from "./navigation-item";
import { NavigationItemStyles as styles } from "./navigation-item.styles";
import { NavigationItemTemplate as template } from "./navigation-item.template";

@customElement({
    name: "site-navigation-item",
    template,
    styles,
})
export class SiteNavigationItem extends NavigationItem {}
export * from "./navigation-item";
export * from "./navigation-item.styles";
export * from "./navigation-item.template";
