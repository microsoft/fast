import { attr, nullableNumberConverter, observable } from "@microsoft/fast-element";
import { FoundationElement } from "../foundation-element/foundation-element.js";

/**
 * An Progress HTML Element.
 * Implements the {@link https://www.w3.org/TR/wai-aria-1.1/#progressbar | ARIA progressbar }.
 *
 * @slot indeterminate - The slot for a custom indeterminate indicator
 * @csspart progress - Represents the progress element
 * @csspart determinate - The determinate indicator
 * @csspart indeterminate - The indeterminate indicator
 *
 * @public
 */
export class BaseProgress extends FoundationElement {
    /**
     * The value of the progress
     * @public
     * @remarks
     * HTML Attribute: value
     */
    @attr({ converter: nullableNumberConverter })
    public value: number | null;
    protected valueChanged(): void {
        if (this.$fastController.isConnected) {
            this.updatePercentComplete();
        }
    }

    /**
     * The minimum value
     * @public
     * @remarks
     * HTML Attribute: min
     */
    @attr({ converter: nullableNumberConverter })
    public min: number;
    protected minChanged(): void {
        if (this.$fastController.isConnected) {
            this.updatePercentComplete();
        }
    }

    /**
     * The maximum value
     * @public
     * @remarks
     * HTML Attribute: max
     */
    @attr({ converter: nullableNumberConverter })
    public max: number;
    protected maxChanged(): void {
        if (this.$fastController.isConnected) {
            this.updatePercentComplete();
        }
    }

    /**
     * Indicates the progress is paused
     * @public
     * @remarks
     * HTML Attribute: paused
     */
    @attr({ mode: "boolean" })
    public paused: boolean;

    /**
     * Indicates progress in %
     * @internal
     */
    @observable
    public percentComplete: number = 0;

    /**
     * @internal
     */
    public connectedCallback(): void {
        super.connectedCallback();
        this.updatePercentComplete();
    }

    private updatePercentComplete(): void {
        const min: number = typeof this.min === "number" ? this.min : 0;
        const max: number = typeof this.max === "number" ? this.max : 100;
        const value: number = typeof this.value === "number" ? this.value : 0;
        const range: number = max - min;

        this.percentComplete =
            range === 0 ? 0 : Math.fround(((value - min) / range) * 100);
    }
}
