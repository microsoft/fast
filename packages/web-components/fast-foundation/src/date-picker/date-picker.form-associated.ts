import { FormAssociated } from "../form-associated/form-associated";
import { FoundationElement } from "../foundation-element";

class _DatePicker extends FoundationElement {}
interface _DatePicker extends FormAssociated {}

/**
 * A form-associated base class for the {@link @microsoft/fast-foundation#(DatePicker:class)} component.
 *
 * @internal
 */
export class FormAssociatedDatePicker extends FormAssociated(_DatePicker) {
    proxy = document.createElement("input");
}
