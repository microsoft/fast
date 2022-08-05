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
     * The internal stylesheet which holds the `--size` custom property.
     *
     * @internal
     */
    private sizeStylesheet: ElementStyles | void | undefined;

    /**
     * Updates the component dimensions when the size property is changed.
     *
     * @param prev - the previous size value
     * @param next - the current size value
     *
     * @internal
     */
    protected sizeChanged(prev: number | unknown, next: number): void {
        super.sizeChanged(prev, next);

        if (this.sizeStylesheet) {
            this.sizeStylesheet = this.$fastController.removeStyles(this.sizeStylesheet);
        }

        if (this.size > 0) {
            this.sizeStylesheet = css`
                :host {
                    --size: ${"" + this.size};
                }
            `;

            this.$fastController.addStyles(this.sizeStylesheet);
        }
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
