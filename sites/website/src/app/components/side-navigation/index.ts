import { customElement } from "@microsoft/fast-element";
import { SideNavigation } from "./side-navigation";
import { SideNavigationTemplate as template } from "./side-navigation.template";
import { SideNavigationStyles as styles } from "./side-navigation.styles";

@customElement({
    name: "site-side-navigation",
    template,
    styles,
})
export class SiteSideNavigation extends SideNavigation {}
export * from "./side-navigation.template";
export * from "./side-navigation.styles";
export * from "./side-navigation";
