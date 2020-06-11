import { customElement } from "@microsoft/fast-element";
import { Navigation } from "./navigation";
import { NavigationTemplate as template } from "./navigation.template";
import { NavigationStyles as styles } from "./navigation.styles";

@customElement({
    name: "site-navigation",
    template,
    styles,
})
export class SiteNavigation extends Navigation {}
export * from "./navigation.template";
export * from "./navigation.styles";
export * from "./navigation";
