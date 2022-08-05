import { FormAssociated } from "../form-associated/form-associated.js";
import { FoundationElement } from "../foundation-element/foundation-element.js";

class _TextField extends FoundationElement {}
interface _TextField extends FormAssociated {}

/**
 * A form-associated base class for the {@link @microsoft/fast-foundation#(TextField:class)} component.
 *
 * @internal
 */
export class FormAssociatedTextField extends FormAssociated(_TextField) {
    proxy = document.createElement("input");
}
