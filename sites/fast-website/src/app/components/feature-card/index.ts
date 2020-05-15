import { customElement } from "@microsoft/fast-element";
import { FeatureCardTemplate as template } from "./feature-card.template";
import { FeatureCardStyles as styles } from "./feature-card.styles";
import { FASTCard as Card } from "@microsoft/fast-components";

@customElement({
    name: "site-feature-card",
    template,
    styles,
})
export class SiteFeatureCard extends Card {}
export * from "./feature-card.template";
export * from "./feature-card.styles";
export * from "./feature-card";
