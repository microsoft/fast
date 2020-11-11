import { customElement } from "@microsoft/fast-element";
import { DesignTokenProvider } from "../design-tokens";
import { Card } from "./card";
import { CardTemplate } from "./card.template";

@customElement({
    name: "fast-card",
    template: CardTemplate,
})
export class FASTCard extends DesignTokenProvider(Card) {}
