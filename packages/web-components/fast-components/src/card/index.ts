import {
    DI,
    Card as FoundationCard,
    CardTemplate as template,
    composedParent,
} from "@microsoft/fast-foundation";
import { fillColor, NeutralFillCard } from "../design-tokens";
import { CardStyles as styles } from "./card.styles";

/**
 * @internal
 */
export class Card extends FoundationCard {
    connectedCallback() {
        super.connectedCallback();

        const parent = composedParent(this);

        if (parent) {
            fillColor.setValueFor(this, (target: HTMLElement) => {
                return DI.findParentContainer(target).get(NeutralFillCard)(
                    target,
                    fillColor.getValueFor(parent)
                );
            });
        }
    }
}

/**
 * The FAST Card Element. Implements {@link @microsoft/fast-foundation#Card},
 * {@link @microsoft/fast-foundation#CardTemplate}
 *
 *
 * @public
 * @remarks
 * HTML Element: \<fast-card\>
 */
export const fastCard = Card.compose({
    baseName: "card",
    template,
    styles,
});

/**
 * Styles for Card
 * @public
 */
export const cardStyles = styles;
