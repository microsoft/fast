import { FormAssociated } from "../form-associated/form-associated.js";
import { Listbox } from "../listbox/listbox.js";

class _Combobox extends Listbox {}
interface _Combobox extends FormAssociated {}

/**
 * A form-associated base class for the {@link (Combobox:class)} component.
 *
 * @beta
 */
export class FormAssociatedCombobox extends FormAssociated(_Combobox) {
    proxy = document.createElement("input");
}
