import { RadioGroup } from "../radio-group/radio-group";

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
