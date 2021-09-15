import {
    attr,
    nullableNumberConverter,
    observable,
    SyntheticViewTemplate,
} from "@microsoft/fast-element";
import { FoundationElement, FoundationElementDefinition } from "../foundation-element";

/**
 * Progress configuration options
 * @public
 */
export type ProgressOptions = FoundationElementDefinition & {
    indeterminateIndicator1?: string | SyntheticViewTemplate;
    indeterminateIndicator2?: string | SyntheticViewTemplate;
};

/**
 * ProgressRing configuration options
 * @public
 */
export type ProgressRingOptions = FoundationElementDefinition & {
    indeterminateIndicator?: string | SyntheticViewTemplate;
};
/**
 * An Progress HTML Element.
 * Implements the {@link https://www.w3.org/TR/wai-aria-1.1/#progressbar | ARIA progressbar }.
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
    private valueChanged(): void {
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
    private minChanged(): void {
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
    private maxChanged(): void {
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
    public paused;

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
