import { customElement } from "@microsoft/fast-element";
import { HoverCard } from "./hover-card";
import { HoverCardTemplate as template } from "./hover-card.template";
import { HoverCardStyles as styles } from "./hover-card.styles";

@customElement({
    name: "fast-hover-card",
    template,
    styles,
})
export class FASTHoverCard extends HoverCard {}
export * from "./hover-card.template";
export * from "./hover-card.styles";
export * from "./hover-card";