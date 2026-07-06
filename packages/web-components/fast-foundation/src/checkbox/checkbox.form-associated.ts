import { FASTElement } from "@microsoft/fast-element";
import { CheckableFormAssociated } from "../form-associated/form-associated.js";

class _Checkbox extends FASTElement {}
interface _Checkbox extends CheckableFormAssociated {}

/**
 * A form-associated base class for the {@link @microsoft/fast-foundation#(Checkbox:class)} component.
 *
 * @beta
 */
export class FormAssociatedCheckbox extends CheckableFormAssociated(_Checkbox) {
    proxy = document.createElement("input");
}
