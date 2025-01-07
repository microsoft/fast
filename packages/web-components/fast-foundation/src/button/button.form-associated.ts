import { FormAssociated } from "../form-associated/form-associated.js";
import { FoundationElement } from "../foundation-element/foundation-element.js";

class _Button extends FoundationElement {}
interface _Button extends FormAssociated {}

/**
 * A form-associated base class for the {@link @ni/fast-foundation#(Button:class)} component.
 *
 * @internal
 */
export class FormAssociatedButton extends FormAssociated(_Button) {
    proxy = document.createElement("input");
}
