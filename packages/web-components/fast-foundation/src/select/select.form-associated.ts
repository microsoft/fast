import { ListboxElement } from "../listbox/listbox.element";
import { FormAssociated } from "../form-associated/form-associated";

class _Select extends ListboxElement {}
interface _Select extends FormAssociated {}

/**
 * A form-associated base class for the {@link @microsoft/fast-foundation#(Select:class)} component.
 *
 * @internal
 */
export class FormAssociatedSelect extends FormAssociated(_Select) {
    proxy = document.createElement("select");
}
