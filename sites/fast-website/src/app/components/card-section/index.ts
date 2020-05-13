import { customElement, FASTElement } from "@microsoft/fast-element";
import { CardSectionTemplate as template } from "./card-section.template";
import { CardSectionStyles as styles } from "./card-section.styles";
import { FASTCard } from "@microsoft/fast-components";

@customElement({
    name: "card-section",
    template,
    styles,
})
export class FeatureCard extends FASTElement {}
export * from "./card-section.template";
export * from "./card-section.styles";
export * from "./card-section";
