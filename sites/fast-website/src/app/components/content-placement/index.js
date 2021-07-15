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
import { ContentPlacement } from "./content-placement";
import { ContentPlacementTemplate as template } from "./content-placement.template";
import { ContentPlacementStyles as styles } from "./content-placement.styles";
let SiteContentPlacement = class SiteContentPlacement extends ContentPlacement {};
SiteContentPlacement = __decorate(
    [
        customElement({
            name: "site-content-placement",
            template,
            styles,
        }),
    ],
    SiteContentPlacement
);
export { SiteContentPlacement };
export * from "./content-placement.template";
export * from "./content-placement.styles";
export * from "./content-placement";
