import { Listbox } from "../listbox/listbox";
import { FormAssociated } from "../form-associated/form-associated";
declare class _Select extends Listbox {}
interface _Select extends FormAssociated {}
declare const FormAssociatedSelect_base: typeof _Select;
/**
 * A form-associated base class for the {@link @microsoft/fast-foundation#(Select:class)} component.
 *
 * @internal
 */
export declare class FormAssociatedSelect extends FormAssociatedSelect_base {
    proxy: HTMLSelectElement;
}
export {};
