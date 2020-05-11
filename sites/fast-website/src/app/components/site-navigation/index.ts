import { customElement } from "@microsoft/fast-element";
import { SiteNavigation } from "./site-navigation";
import { SiteNavigationTemplate as template } from "./site-navigation.template";
import { SiteNavigationStyles as styles } from "./site-navigation.styles";

@customElement({
    name: "fast-site-navigation",
    template,
    styles,
})
export class FASTSiteNavigation extends SiteNavigation {}
export * from "./site-navigation.template";
export * from "./site-navigation.styles";
export * from "./site-navigation";
