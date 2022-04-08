import { Listbox } from "../listbox/listbox.js";
import { FormAssociated } from "../form-associated/form-associated.js";

class _Select extends Listbox {}
interface _Select extends FormAssociated {}

/**
 * A form-associated base class for the {@link @microsoft/fast-foundation#(Select:class)} component.
 *
 * @internal
 */
export class FormAssociatedSelect extends FormAssociated(_Select) {
    proxy = document.createElement("select");
}
