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
import { NavigationItem } from "./navigation-item";
import { NavigationItemStyles as styles } from "./navigation-item.styles";
import { NavigationItemTemplate as template } from "./navigation-item.template";
let SiteNavigationItem = class SiteNavigationItem extends NavigationItem {};
SiteNavigationItem = __decorate(
    [
        customElement({
            name: "site-navigation-item",
            template,
            styles,
        }),
    ],
    SiteNavigationItem
);
export { SiteNavigationItem };
export * from "./navigation-item";
export * from "./navigation-item.styles";
export * from "./navigation-item.template";
