import { customElement } from "@microsoft/fast-element";
import { Card, CardTemplate as template } from "@microsoft/fast-components";
import { CardStyles as styles } from "./card.styles";

@customElement({
    name: "msft-card",
    template,
    styles,
})
export class MSFTCard extends Card {}
