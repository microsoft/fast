import { Listbox } from "../listbox/listbox";
import { FormAssociated } from "../form-associated/form-associated";

/**
 * Normally this would be passed as an anonymous class directly to the
 * {@link (FormAssociated:function)} mixin function. TypeScript 4+ throws an
 * error when base accessors are overridden in a subclass. Combobox overrides
 * the `options` accessors in Listbox.
 */
class ComboboxListbox extends Listbox {
    public proxy: HTMLInputElement = document.createElement("input");
}

/**
 * A form-associated base class for the {@link (Combobox:class)} component.
 *
 * @internal
 */
export class FormAssociatedCombobox extends FormAssociated(ComboboxListbox) {}

/**
 * @internal
 */
export interface FormAssociatedCombobox extends FormAssociated {}
