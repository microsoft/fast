import { customElement, FASTElement } from "@microsoft/fast-element";
import { CardSectionTemplate as template } from "./card-section.template";
import { CardSectionStyles as styles } from "./card-section.styles";

@customElement({
    name: "site-card-section",
    template,
    styles,
})
export class SiteCardSection extends FASTElement {}
export * from "./card-section.template";
export * from "./card-section.styles";
export * from "./card-section";
