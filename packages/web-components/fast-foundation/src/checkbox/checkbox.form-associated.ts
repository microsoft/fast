import { FormAssociated } from "../form-associated/form-associated";
import { FoundationElement } from "../foundation-element";

class _Checkbox extends FoundationElement {}
interface _Checkbox extends FormAssociated {}

/**
 * A form-associated base class for the {@link @microsoft/fast-foundation#(Checkbox:class)} component.
 *
 * @internal
 */
export class FormAssociatedCheckbox extends FormAssociated(_Checkbox) {
    proxy = document.createElement("input");
}
