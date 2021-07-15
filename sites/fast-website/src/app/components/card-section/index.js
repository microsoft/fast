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
import { CardSectionTemplate as template } from "./card-section.template";
import { CardSectionStyles as styles } from "./card-section.styles";
import { CardSection } from "./card-section";
let SiteCardSection = class SiteCardSection extends CardSection {};
SiteCardSection = __decorate(
    [
        customElement({
            name: "site-card-section",
            template,
            styles,
        }),
    ],
    SiteCardSection
);
export { SiteCardSection };
export * from "./card-section.template";
export * from "./card-section.styles";
export * from "./card-section";
