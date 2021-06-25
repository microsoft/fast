import { FormAssociated } from "../form-associated/form-associated";
import { FoundationElement } from "../foundation-element";

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
