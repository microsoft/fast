import { customElement } from "@microsoft/fast-element";
import { FeatureCardTemplate as template } from "./feature-card.template";
import { FeatureCardStyles as styles } from "./feature-card.styles";
import { FeatureCard } from "./feature-card";

@customElement({
    name: "site-feature-card",
    template,
    styles,
})
export class SiteFeatureCard extends FeatureCard {}
export * from "./feature-card.template";
export * from "./feature-card.styles";
export * from "./feature-card";
