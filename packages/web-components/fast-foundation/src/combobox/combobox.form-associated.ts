import { FormAssociated } from "../form-associated/form-associated";
import { Listbox } from "../listbox/listbox";

class _Combobox extends Listbox {}
interface _Combobox extends FormAssociated {}

/**
 * A form-associated base class for the {@link (Combobox:class)} component.
 *
 * @internal
 */
export class FormAssociatedCombobox extends FormAssociated(_Combobox) {
    proxy = document.createElement("input");
}
