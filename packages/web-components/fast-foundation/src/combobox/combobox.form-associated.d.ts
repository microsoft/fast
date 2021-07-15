import { FormAssociated } from "../form-associated/form-associated";
import { Listbox } from "../listbox/listbox";
declare class _Combobox extends Listbox {}
interface _Combobox extends FormAssociated {}
declare const FormAssociatedCombobox_base: typeof _Combobox;
/**
 * A form-associated base class for the {@link (Combobox:class)} component.
 *
 * @internal
 */
export declare class FormAssociatedCombobox extends FormAssociatedCombobox_base {
    proxy: HTMLInputElement;
}
export {};
