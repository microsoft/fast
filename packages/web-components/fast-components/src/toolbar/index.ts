import {
    composedParent,
    Toolbar as FoundationToolbar,
    toolbarTemplate as template,
} from "@microsoft/fast-foundation";
import { Swatch } from "../color/swatch.js";
import { fillColor, neutralFillLayerRecipe } from "../design-tokens.js";
import { toolbarStyles as styles } from "./toolbar.styles.js";

/**
 * @internal
 */
export class Toolbar extends FoundationToolbar {
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
 * A function that returns a {@link @microsoft/fast-foundation#Toolbar} registration for configuring the component with a DesignSystem.
 * Implements {@link @microsoft/fast-foundation#toolbarTemplate}
 *
 * @public
 * @remarks
 *
 * Generates HTML Element: `<fast-toolbar>`
 *
 */
export const fastToolbar = Toolbar.compose({
    baseName: "toolbar",
    baseClass: FoundationToolbar,
    template,
    styles,
    shadowOptions: {
        delegatesFocus: true,
    },
});

export { styles as toolbarStyles };
