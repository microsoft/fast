import { attr } from "@microsoft/fast-element";
import type { RatingItem } from "..";
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
        this.setValueChangedClass();
    }

    public setValueChangedClass(): void {
        if (this.$fastController.isConnected) {
            this.slottedRadioButtons.forEach((rating: HTMLInputElement) => {
                if (rating.value <= this.value) {
                    rating.classList.add("rating-checked");
                } else {
                    rating.classList.remove("rating-checked");
                }
            });
        }
    }

    /**
     * @internal
     */
    public onMouseover = (e: MouseEvent): void => {
        if (this.slottedRadioButtons) {
            const targetValue = (e.target as HTMLInputElement).value;
            this.slottedRadioButtons.forEach((rating: HTMLInputElement) => {
                if (rating.value <= targetValue) {
                    rating.classList.add("highlight");
                } else {
                    rating.classList.remove("highlight");
                }
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
        this.setValueChangedClass();
    }

    /**
     * @internal
     */
    // public disconnectedCallback(): void {
    //     this.slottedRadioButtons.forEach((rating: HTMLInputElement) => {
    //         rating.removeEventListener("mouseover", this.onMouseover);
    //     });
    // }
}
