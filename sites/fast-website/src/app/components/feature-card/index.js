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
import { FeatureCardTemplate as template } from "./feature-card.template";
import { FeatureCardStyles as styles } from "./feature-card.styles";
import { FeatureCard } from "./feature-card";
let SiteFeatureCard = class SiteFeatureCard extends FeatureCard {};
SiteFeatureCard = __decorate(
    [
        customElement({
            name: "site-feature-card",
            template,
            styles,
        }),
    ],
    SiteFeatureCard
);
export { SiteFeatureCard };
export * from "./feature-card.template";
export * from "./feature-card.styles";
export * from "./feature-card";
