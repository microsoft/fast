import { customElement } from "@microsoft/fast-element";
import { Card } from "./card";
import { CardTemplate as template } from "./card.template";
import { CardStyles as styles } from "./card.styles";
import { consumer } from "../design-system-provider/design-system-consumer";
import { neutrallayercard } from "../styles/recipes";

@customElement({
    name: "fast-card",
    template,
    styles,
})
@consumer({
    recipes: [neutrallayercard],
})
export class FASTCard extends Card {}
export * from "./card.template";
export * from "./card.styles";
export * from "./card";
