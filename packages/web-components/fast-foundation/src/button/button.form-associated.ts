import { FormAssociated } from "../form-associated/form-associated";
import { FoundationElement } from "../foundation-element";

class _Button extends FoundationElement {}
interface _Button extends FormAssociated {}

/**
 * A form-associated base class for the {@link @microsoft/fast-foundation#(Button:class)} component.
 *
 * @internal
 */
export class FormAssociatedButton extends FormAssociated(_Button) {
    proxy = document.createElement("input");
}
