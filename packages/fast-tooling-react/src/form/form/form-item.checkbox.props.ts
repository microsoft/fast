import FormItemCommon from "./form-item.props";
import { ManagedClasses } from "@microsoft/fast-jss-manager";

/**
 * Checkbox class name contract
 */
export interface FormItemCheckboxClassNameContract {
    formItemCheckbox?: string;
    formItemCheckbox__disabled?: string;
    formItemCheckbox_badge?: string;
    formItemCheckbox_control?: string;
    formItemCheckbox_label?: string;
    formItemCheckbox_input?: string;
    formItemCheckbox_invalidMessage?: string;
    formItemCheckbox_softRemove?: string;
    formItemCheckbox_softRemoveInput?: string;
}

export type FormItemCheckboxProps = FormItemCommon &
    ManagedClasses<FormItemCheckboxClassNameContract>;
