var __decorate =
    (this && this.__decorate) ||
    function (decorators, target, key, desc) {
        var c = arguments.length,
            r =
                c < 3
                    ? target
                    : desc === null
                    ? (desc = Object.getOwnPropertyDescriptor(target, key))
                    : desc,
            d;
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function")
            r = Reflect.decorate(decorators, target, key, desc);
        else
            for (var i = decorators.length - 1; i >= 0; i--)
                if ((d = decorators[i]))
                    r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
import { customElement } from "@microsoft/fast-element";
import { SideNavigation } from "./side-navigation";
import { SideNavigationTemplate as template } from "./side-navigation.template";
import { SideNavigationStyles as styles } from "./side-navigation.styles";
let SiteSideNavigation = class SiteSideNavigation extends SideNavigation {};
SiteSideNavigation = __decorate(
    [
        customElement({
            name: "site-side-navigation",
            template,
            styles,
        }),
    ],
    SiteSideNavigation
);
export { SiteSideNavigation };
export * from "./side-navigation.template";
export * from "./side-navigation.styles";
export * from "./side-navigation";
