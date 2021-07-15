import { FormAssociated } from "../form-associated/form-associated";
import { Listbox } from "../listbox/listbox";
class _Combobox extends Listbox {}
/**
 * A form-associated base class for the {@link (Combobox:class)} component.
 *
 * @internal
 */
export class FormAssociatedCombobox extends FormAssociated(_Combobox) {
    constructor() {
        super(...arguments);
        this.proxy = document.createElement("input");
    }
}
