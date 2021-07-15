import { Listbox } from "../listbox/listbox";
import { FormAssociated } from "../form-associated/form-associated";
class _Select extends Listbox {}
/**
 * A form-associated base class for the {@link @microsoft/fast-foundation#(Select:class)} component.
 *
 * @internal
 */
export class FormAssociatedSelect extends FormAssociated(_Select) {
    constructor() {
        super(...arguments);
        this.proxy = document.createElement("select");
    }
}
