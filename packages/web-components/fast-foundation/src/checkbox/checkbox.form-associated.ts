import { CheckableFormAssociated } from "../form-associated/form-associated.js";
import { FoundationElement } from "../foundation-element/foundation-element.js";

class _Checkbox extends FoundationElement {}
interface _Checkbox extends CheckableFormAssociated {}

/**
 * A form-associated base class for the {@link @ni/fast-foundation#(Checkbox:class)} component.
 *
 * @internal
 */
export class FormAssociatedCheckbox extends CheckableFormAssociated(_Checkbox) {
    proxy = document.createElement("input");
}
