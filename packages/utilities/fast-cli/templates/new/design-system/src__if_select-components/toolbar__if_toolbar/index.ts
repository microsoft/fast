import {
    composedParent,
    Toolbar as FoundationToolbar,
    toolbarTemplate as template,
} from "@microsoft/fast-foundation";
import { Swatch } from "../color/swatch";
import { fillColor, neutralFillLayerRecipe } from "../design-tokens";
import { toolbarStyles as styles } from "./toolbar.styles";

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
 * A function that returns a Toolbar registration for configuring the component with a DesignSystem.
 * Implements Toolbar
 *
 * @public
 * @remarks
 *
 * Generates HTML Element: \</* @echo namespace */-toolbar\>
 *
 */
export const /* @echo namespace */Toolbar = Toolbar.compose({
    baseName: "toolbar",
    template,
    styles,
    shadowOptions: {
        delegatesFocus: true,
    },
});
/**
 * Styles for Toolbar.
 * @public
 */
export const toolbarStyles = styles;
