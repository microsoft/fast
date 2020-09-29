import { customElement } from "@microsoft/fast-element";
import {
    Card,
    CardTemplate as template,
    defineDesignSystemProvider,
} from "@microsoft/fast-foundation";
import { neutralFillCard } from "../color";
import { CardStyles as styles } from "./card.styles";

/**
 * The FAST Card Element. Implements {@link @microsoft/fast-foundation#Card},
 * {@link @microsoft/fast-foundation#CardTemplate}
 *
 *
 * @public
 * @remarks
 * HTML Element: \<fast-card\>
 */
@defineDesignSystemProvider({
    name: "fast-card",
    template,
    styles,
})
export class FASTCard extends Card {
    connectedCallback() {
        this.backgroundColor = neutralFillCard(this.provider?.designSystem as any);

        super.connectedCallback();
    }
}

/**
 * Styles for Card
 * @public
 */
export const CardStyles = styles;
