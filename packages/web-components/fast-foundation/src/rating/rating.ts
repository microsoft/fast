import { attr } from "@microsoft/fast-element";
import type { RatingItem } from "..";
import { RadioGroup } from "../radio-group/radio-group";

/**
 * Rating type for {@link Rating}
 * @public
 */
export enum RatingMode {
    multiple = "multiple",
    single = "single",
}

/**
 * An Rating Custom HTML Element.
 *
 * @public
 */
export class Rating extends RadioGroup {
    // public ratingChangeHandler(e: CustomEvent): void {
    //     (e.target as RadioGroup).value;
    //     this.value = (e.target as RadioGroup).value;
    //     this.$emit("change");
    //     console.log("blah", (e.target as RadioGroup).value);
    // }

    /**
     * Set the rating component to be a multiple or single selected item system.
     * @public
     *
     * @remarks
     * HTML attribute: rating-mode
     */
    @attr({ attribute: "rating-mode" })
    public ratingmode: RatingMode = RatingMode.multiple;

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

    private isSingleRatingMode(): boolean {
        return this.ratingmode === RatingMode.single;
    }

    /**
     * @internal
     */
    // public connectedCallback(): void {
    //     super.connectedCallback();
    // }

    /**
     * @internal
     */
    // public disconnectedCallback(): void {
    //     this.slottedRadioButtons.forEach((rating: HTMLInputElement) => {
    //         rating.removeEventListener("mouseover", this.onMouseover);
    //     });
    // }
}
