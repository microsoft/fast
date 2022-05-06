import { css, ElementStyles, observable } from "@microsoft/fast-element";
import {
    Select as FoundationSelect,
    SelectOptions,
    selectTemplate as template,
} from "@microsoft/fast-foundation";
import {
    fillColor,
    heightNumberAsToken,
    neutralLayerFloating,
} from "../design-tokens.js";
import { selectStyles as styles } from "./select.styles.js";

/**
 * Base class for Select.
 * @public
 */
export class Select extends FoundationSelect {
    /**
     * An internal stylesheet to hold calculated CSS custom properties.
     *
     * @internal
     */
    private computedStylesheet?: ElementStyles;

    /**
     * @internal
     */
    public connectedCallback(): void {
        super.connectedCallback();

        if (this.listbox) {
            fillColor.setValueFor(this.listbox, neutralLayerFloating);
        }
    }

    /**
     * Returns the calculated max height for the listbox.
     *
     * @internal
     * @remarks
     * Used to generate the `--listbox-max-height` CSS custom property.
     *
     */
    private get listboxMaxHeight(): string {
        return Math.floor(
            this.maxHeight / heightNumberAsToken.getValueFor(this)
        ).toString();
    }

    /**
     * The cached scroll width of the listbox when visible.
     *
     * @internal
     */
    @observable
    private listboxScrollWidth: string = "";

    /**
     * @internal
     */
    protected listboxScrollWidthChanged(): void {
        this.updateComputedStylesheet();
    }

    /**
     * Returns the size value, if any. Otherwise, returns 4 if in
     * multi-selection mode, or 0 if in single-selection mode.
     *
     * @internal
     * @remarks
     * Used to generate the `--size` CSS custom property.
     *
     */
    private get selectSize(): string {
        return `${this.size ?? (this.multiple ? 4 : 0)}`;
    }

    /**
     * Updates the computed stylesheet when the multiple property changes.
     *
     * @param prev - the previous multiple value
     * @param next - the current multiple value
     *
     * @override
     * @internal
     */
    public multipleChanged(prev: boolean | undefined, next: boolean): void {
        super.multipleChanged(prev, next);
        this.updateComputedStylesheet();
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
            this.updateComputedStylesheet();
        }
    }

    public setPositioning(): void {
        super.setPositioning();
        this.updateComputedStylesheet();
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
        this.updateComputedStylesheet();

        if (this.collapsible) {
            requestAnimationFrame(() => {
                this.listbox.style.setProperty("display", "flex");
                this.listbox.style.setProperty("overflow", "visible");
                this.listbox.style.setProperty("visibility", "hidden");
                this.listbox.style.setProperty("width", "auto");
                this.listbox.hidden = false;

                this.listboxScrollWidth = `${this.listbox.scrollWidth}`;

                this.listbox.hidden = true;
                this.listbox.style.removeProperty("display");
                this.listbox.style.removeProperty("overflow");
                this.listbox.style.removeProperty("visibility");
                this.listbox.style.removeProperty("width");
            });

            return;
        }

        this.listboxScrollWidth = "";
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

        this.computedStylesheet = css`
            :host {
                --listbox-max-height: ${this.listboxMaxHeight};
                --listbox-scroll-width: ${this.listboxScrollWidth};
                --size: ${this.selectSize};
            }
        `;

        this.$fastController.addStyles(this.computedStylesheet);
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
