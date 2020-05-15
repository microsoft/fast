import { customElement } from "@microsoft/fast-element";
import { Card, CardTemplate as template } from "@microsoft/fast-foundation";
import { CardStyles as styles } from "./card.styles.js";

@customElement({
    name: "fast-card",
    template,
    styles,
})
export class FASTCard extends Card {}
