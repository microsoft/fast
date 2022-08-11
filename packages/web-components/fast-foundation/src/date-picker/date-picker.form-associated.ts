import { FASTElement } from "@microsoft/fast-element";
import { FormAssociated } from "../form-associated/form-associated.js";

class _DatePicker extends FASTElement {}
interface _DatePicker extends FormAssociated {}

/**
 * A form-associated base class for the {@link @microsoft/fast-foundation#(DatePicker:class)} component.
 *
 * @internal
 */
export class FormAssociatedDatePicker extends FormAssociated(_DatePicker) {
    proxy = document.createElement("input");
}
