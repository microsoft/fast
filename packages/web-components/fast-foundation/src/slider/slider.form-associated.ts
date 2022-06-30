import { FASTElement } from "@microsoft/fast-element";
import { FormAssociated } from "../form-associated/form-associated.js";

class _Slider extends FASTElement {}
interface _Slider extends FormAssociated {}

/**
 * A form-associated base class for the {@link @microsoft/fast-foundation#(Slider:class)} component.
 *
 * @beta
 */
export class FormAssociatedSlider extends FormAssociated(_Slider) {
    proxy = document.createElement("input");
}
