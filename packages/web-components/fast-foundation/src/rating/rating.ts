import { DOM } from "@microsoft/fast-element";
import { RadioGroup } from "../radio-group/radio-group";

/**
 * An Rating Custom HTML Element.
 *
 * @public
 */
export class Rating extends RadioGroup {
    /**
     * @internal
     */
    protected slottedRadioButtonsChanged(oldValue, newValue): void {
        super.slottedRadioButtonsChanged(oldValue, newValue);
        if (this.slottedRadioButtons && this.slottedRadioButtons.length > 0) {
            this.slottedRadioButtons.forEach((rating: HTMLInputElement) => {
                rating.addEventListener("mouseover", this.onMouseover);
                rating.addEventListener("mouseout", this.onMouseout);
            });
        }
    }

    protected valueChanged(): void {
        super.valueChanged();
        if (this.$fastController.isConnected) {
            this.setValueChangedClass();
        }
    }

    public setValueChangedClass(): void {
        this.slottedRadioButtons.forEach((rating: HTMLInputElement) => {
            rating.classList.toggle("rating-checked", rating.value <= this.value);
        });
    }

    /**
     * @internal
     */
    public onMouseover = (e: MouseEvent): void => {
        if (this.slottedRadioButtons) {
            const targetValue = (e.target as HTMLInputElement).value;
            this.slottedRadioButtons.forEach((rating: HTMLInputElement) => {
                rating.classList.toggle("highlight", rating.value <= targetValue);
            });
        }
    };

    /**
     * @internal
     */
    public onMouseout = (e: MouseEvent): void => {
        this.slottedRadioButtons.forEach((rating: HTMLInputElement) => {
            rating.classList.remove("highlight");
        });
    };

    /**
     * @internal
     */
    public connectedCallback(): void {
        super.connectedCallback();
        DOM.queueUpdate(() => {
            this.setValueChangedClass();
        });
    }

    /**
     * @internal
     */
    public disconnectedCallback(): void {
        if (this.slottedRadioButtons && this.slottedRadioButtons.length > 0) {
            this.slottedRadioButtons.forEach((rating: HTMLInputElement) => {
                rating.removeEventListener("mouseover", this.onMouseover);
                rating.removeEventListener("mouseout", this.onMouseout);
            });
        }
    }
}
