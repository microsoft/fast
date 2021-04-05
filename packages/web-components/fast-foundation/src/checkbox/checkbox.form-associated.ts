import { FASTElement } from "@microsoft/fast-element";
import { FormAssociated } from "../form-associated/form-associated";

class _Checkbox extends FASTElement {}
interface _Checkbox extends FormAssociated {}

/**
 * A form-associated base class for the {@link @microsoft/fast-foundation#(Checkbox:class)} component.
 *
 * @internal
 */
export class FormAssociatedCheckbox extends FormAssociated(_Checkbox) {
    proxy = document.createElement("input");
}
