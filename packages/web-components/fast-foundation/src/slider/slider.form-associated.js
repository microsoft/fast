import { FormAssociated } from "../form-associated/form-associated";
import { FoundationElement } from "../foundation-element";
class _Slider extends FoundationElement {}
/**
 * A form-associated base class for the {@link @microsoft/fast-foundation#(Slider:class)} component.
 *
 * @internal
 */
export class FormAssociatedSlider extends FormAssociated(_Slider) {
    constructor() {
        super(...arguments);
        this.proxy = document.createElement("input");
    }
}
