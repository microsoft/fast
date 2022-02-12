import {
    Select as FoundationSelect,
    SelectOptions,
    selectTemplate as template,
} from "@microsoft/fast-foundation";
import { optionHeight } from "../listbox-option/listbox-option.styles.js";
import { listboxSize } from "../listbox/listbox.styles.js";
import {
    selectMaxSize,
    selectOptionWidth,
    selectStyles as styles,
} from "./select.styles.js";

/**
 * Base class for Select.
 * @public
 */
export class Select extends FoundationSelect {
    /**
     * Sets the listboxSize design token when the multiple property changes.
     *
     * @param prev - the previous multiple value
     * @param next - the current multiple value
     *
     * @override
     * @internal
     */
    public multipleChanged(prev: boolean | undefined, next: boolean): void {
        super.multipleChanged(prev, next);
        listboxSize.setValueFor(this, this.size || (next ? 4 : 0));
    }

    /**
     * Sets the selectMaxSize design token when the maxHeight property changes.
     *
     * @param prev - the previous maxHeight value
     * @param next - the current maxHeight value
     *
     * @internal
     */
    protected maxHeightChanged(prev: number | undefined, next: number): void {
        if (this.collapsible) {
            selectMaxSize.setValueFor(this, target => {
                return Math.floor(this.maxHeight / optionHeight.getValueFor(this));
            });
        }
    }

    /**
     * Updates the component dimensions when the size property is changed.
     *
     * @param prev - the previous size value
     * @param next - the current size value
     *
     * @override
     * @internal
     */
    protected sizeChanged(prev: number | undefined, next: number): void {
        super.sizeChanged(prev, next);

        if (this.multiple) {
            listboxSize.setValueFor(this, this.size || 4);
        } else {
            listboxSize.setValueFor(this, this.size || 0);
        }

        if (this.collapsible) {
            requestAnimationFrame(() => {
                this.listbox.style.setProperty("display", "flex");
                this.listbox.style.setProperty("overflow", "visible");
                this.listbox.style.setProperty("visibility", "hidden");
                this.listbox.style.setProperty("width", "auto");
                this.listbox.hidden = false;

                selectOptionWidth.setValueFor(this, this.listbox.scrollWidth);

                this.listbox.hidden = true;
                this.listbox.style.removeProperty("display");
                this.listbox.style.removeProperty("overflow");
                this.listbox.style.removeProperty("visibility");
                this.listbox.style.removeProperty("width");
            });

            return;
        }

        selectOptionWidth.setValueFor(this, 0);
    }
}

/**
 * A function that returns a {@link @microsoft/fast-foundation#Select} registration for configuring the component with a DesignSystem.
 * Implements {@link @microsoft/fast-foundation#selectTemplate}
 *
 *
 * @public
 * @remarks
 * Generates HTML Element: `<fast-select>`
 *
 */
export const fastSelect = Select.compose<SelectOptions>({
    baseName: "select",
    baseClass: FoundationSelect,
    template,
    styles,
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

export { styles as selectStyles };
