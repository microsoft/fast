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
import { ContentPlacementContainer } from "./content-placement-container";
import { ContentPlacementContainerTemplate as template } from "./content-placement-container.template";
import { ContentPlacementContainerStyles as styles } from "./content-placement-container.styles";
let SiteContentPlacementContainer = class SiteContentPlacementContainer extends ContentPlacementContainer {};
SiteContentPlacementContainer = __decorate(
    [
        customElement({
            name: "site-content-placement-container",
            template,
            styles,
        }),
    ],
    SiteContentPlacementContainer
);
export { SiteContentPlacementContainer };
export * from "./content-placement-container.template";
export * from "./content-placement-container.styles";
export * from "./content-placement-container";
