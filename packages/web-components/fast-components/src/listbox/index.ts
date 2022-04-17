import { css, ElementStyles } from "@microsoft/fast-element";
import {
    ListboxElement as FoundationListboxElement,
    listboxTemplate as template,
} from "@microsoft/fast-foundation";
import { listboxStyles as styles } from "./listbox.styles.js";

/**
 * Base class for Listbox.
 *
 * @public
 */
export class Listbox extends FoundationListboxElement {
    /**
     * An internal stylesheet to hold calculated CSS custom properties.
     *
     * @internal
     */
    private computedStylesheet?: ElementStyles;

    /**
     * Updates the component dimensions when the size property is changed.
     *
     * @param prev - the previous size value
     * @param next - the current size value
     *
     * @internal
     */
    protected sizeChanged(prev: number | undefined, next: number): void {
        super.sizeChanged(prev, next);
        this.updateComputedStylesheet();
    }

    /**
     * Updates an internal stylesheet with calculated CSS custom properties.
     *
     * @internal
     */
    protected updateComputedStylesheet(): void {
        if (this.computedStylesheet) {
            this.$fastController.removeStyles(this.computedStylesheet);
        }

        const listboxSize = `${this.size}`;

        this.computedStylesheet = css`
            :host {
                --size: ${listboxSize};
            }
        `;

        this.$fastController.addStyles(this.computedStylesheet);
    }
}

/**
 * A function that returns a {@link @microsoft/fast-foundation#ListboxElement} registration for configuring the component with a DesignSystem.
 * Implements {@link @microsoft/fast-foundation#listboxTemplate}
 *
 * @remarks
 * Generates HTML Element: `<fast-listbox>`
 *
 * @public
 *
 */
export const fastListbox = Listbox.compose({
    baseName: "listbox",
    baseClass: FoundationListboxElement,
    template,
    styles,
});

export { styles as listboxStyles };
