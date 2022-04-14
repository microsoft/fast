import {
    composedParent,
    Card as FoundationCard,
    cardTemplate as template,
} from "@microsoft/fast-foundation";
import { Swatch } from "../color/swatch.js";
import { fillColor, neutralFillLayerRecipe } from "../design-tokens.js";
import { cardStyles as styles } from "./card.styles.js";

/**
 * @internal
 */
export class Card extends FoundationCard {
    connectedCallback() {
        super.connectedCallback();

        const parent = composedParent(this);

        if (parent) {
            fillColor.setValueFor(
                this,
                (target: HTMLElement): Swatch =>
                    neutralFillLayerRecipe
                        .getValueFor(target)
                        .evaluate(target, fillColor.getValueFor(parent))
            );
        }
    }
}

/**
 * A function that returns a {@link @microsoft/fast-foundation#Card} registration for configuring the component with a DesignSystem.
 * Implements {@link @microsoft/fast-foundation#cardTemplate}
 *
 *
 * @public
 * @remarks
 * Generates HTML Element: `<fast-card>`
 */
export const fastCard = Card.compose({
    baseName: "card",
    baseClass: FoundationCard,
    template,
    styles,
});

export { styles as cardStyles };
