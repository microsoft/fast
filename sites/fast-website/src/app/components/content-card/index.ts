import { customElement } from "@microsoft/fast-element";
import { ContentCard } from "./content-card";
import { ContentCardTemplate as template } from "./content-card.template";
import { ContentCardStyles as styles } from "./content-card.styles";

@customElement({
    name: "fast-content-card",
    template,
    styles,
})
export class FASTContentCard extends ContentCard {}
export * from "./content-card.template";
export * from "./content-card.styles";
export * from "./content-card";
