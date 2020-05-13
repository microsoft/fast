import { customElement } from "@microsoft/fast-element";
import { FeatureCardTemplate as template } from "./feature-card.template";
import { FeatureCardStyles as styles } from "./feature-card.styles";
import { FASTCard } from "@microsoft/fast-components";

@customElement({
    name: "feature-card",
    template,
    styles,
})
export class FeatureCard extends FASTCard {}
export * from "./feature-card.template";
export * from "./feature-card.styles";
export * from "./feature-card";
