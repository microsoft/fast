import { css, ElementStyles } from "@microsoft/fast-element";
import {
    Combobox as FoundationCombobox,
    ComboboxOptions,
    comboboxTemplate as template,
} from "@microsoft/fast-foundation";
import type { ComboboxOptions } from "@microsoft/fast-foundation";
import { heightNumberAsToken } from "../design-tokens.js";
import { comboboxStyles as styles } from "./combobox.styles.js";

/**
 * Base class for Combobox.
 * @public
 */
export class Combobox extends FoundationCombobox {
    /**
     * An internal stylesheet to hold calculated CSS custom properties.
     *
     * @internal
     */
    private computedStylesheet?: ElementStyles;

    /**
     * @internal
     */
    protected maxHeightChanged(prev: number | undefined, next: number): void {
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

        const popupMaxHeight = Math.floor(
            this.maxHeight / heightNumberAsToken.getValueFor(this)
        ).toString();

        this.computedStylesheet = css`
            :host {
                --listbox-max-height: ${popupMaxHeight};
            }
        `;

        this.$fastController.addStyles(this.computedStylesheet);
    }
}

/**
 * A function that returns a {@link @microsoft/fast-foundation#Combobox} registration for configuring the component with a DesignSystem.
 * Implements {@link @microsoft/fast-foundation#comboboxTemplate}
 *
 * @public
 * @remarks
 * Generates HTML Element: `<fast-combobox>`
 *
 */
export const fastCombobox = Combobox.compose<ComboboxOptions>({
    baseName: "combobox",
    baseClass: FoundationCombobox,
    template,
    styles,
    shadowOptions: {
        delegatesFocus: true,
    },
    indicator: /* html */ `
        <svg
            class="select-indicator"
            part="select-indicator"
            viewBox="0 0 12 7"
            xmlns="http://www.w3.org/2000/svg"
        >
            <path
                d="M11.85.65c.2.2.2.5 0 .7L6.4 6.84a.55.55 0 01-.78 0L.14 1.35a.5.5 0 11.71-.7L6 5.8 11.15.65c.2-.2.5-.2.7 0z"
            />
        </svg>
    `,
});

export { styles as comboboxStyles };
