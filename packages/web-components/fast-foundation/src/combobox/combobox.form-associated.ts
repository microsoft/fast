import { Listbox } from "../listbox/listbox";
import { FormAssociated } from "../form-associated/form-associated";

/**
 * A form-associated base class for the {@link (Combobox:class)} component.
 *
 * @internal
 */
export class FormAssociatedCombobox extends FormAssociated(
    class extends Listbox {
        public proxy: HTMLInputElement = document.createElement("input");
    }
) {}

/**
 * @internal
 */
export interface FormAssociatedCombobox extends FormAssociated {}
