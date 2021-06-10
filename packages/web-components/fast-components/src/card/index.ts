import {
    composedParent,
    DI,
    Card as FoundationCard,
    CardTemplate as template,
} from "@microsoft/fast-foundation";
import { fillColor, NeutralFillLayer } from "../design-tokens";
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
                return DI.findParentContainer(target).get(NeutralFillLayer)(
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
