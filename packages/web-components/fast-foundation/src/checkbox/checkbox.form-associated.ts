import { CheckableFormAssociated } from "../form-associated/form-associated";
import { FoundationElement } from "../foundation-element";

class _Checkbox extends FoundationElement {}
interface _Checkbox extends CheckableFormAssociated {}

/**
 * A form-associated base class for the {@link @microsoft/fast-foundation#(Checkbox:class)} component.
 *
 * @internal
 */
export class FormAssociatedCheckbox extends CheckableFormAssociated(_Checkbox) {
    proxy = document.createElement("input");
}
