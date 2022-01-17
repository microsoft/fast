import {
    composedParent,
    LoaderCard as FoundationLoaderCard,
    loaderCardTemplate as template,
} from "@microsoft/fast-foundation";
import { Swatch } from "../color/swatch";
import { fillColor, neutralFillLayerRecipe } from "../design-tokens";
import { loaderCardStyles as styles } from "./loader-card.styles";

/**
 * @internal
 */
export class LoaderCard extends FoundationLoaderCard {
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
 * A function that returns a {@link @microsoft/fast-foundation#LoaderCard} registration for configuring the component with a DesignSystem.
 * Implements {@link @microsoft/fast-foundation#loaderCardTemplate}
 *
 *
 * @public
 * @remarks
 * Generates HTML Element: `<fast-loader-card>`
 */
export const fastLoaderCard = LoaderCard.compose({
    baseName: "loader-card",
    baseClass: FoundationLoaderCard,
    template,
    styles,
});

export { styles as loaderCardStyles };
