import { FormAssociated } from "../form-associated/form-associated.js";
import { FASTListbox } from "../listbox/listbox.js";

class _Combobox extends FASTListbox {}
interface _Combobox extends FormAssociated {}

/**
 * A form-associated base class for the {@link (Combobox:class)} component.
 *
 * @beta
 */
export class FormAssociatedCombobox extends FormAssociated(_Combobox) {
    proxy = document.createElement("input");
}
