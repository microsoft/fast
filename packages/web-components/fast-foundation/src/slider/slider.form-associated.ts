import { FormAssociated } from "../form-associated/form-associated";
import { FoundationElement } from "../foundation-element";

class _Slider extends FoundationElement {}
interface _Slider extends FormAssociated {}

/**
 * A form-associated base class for the {@link @microsoft/fast-foundation#(Slider:class)} component.
 *
 * @internal
 */
export class FormAssociatedSlider extends FormAssociated(_Slider) {
    proxy = document.createElement("input");
}
