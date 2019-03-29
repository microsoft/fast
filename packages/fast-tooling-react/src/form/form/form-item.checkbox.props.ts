import FormItemCommon from "./form-item.props";

/**
 * Checkbox class name contract
 */
export interface FormItemCheckboxClassNameContract {
    formItemCheckbox?: string;
    formItemCheckbox__disabled?: string;
    formItemCheckbox_badge?: string;
    formItemCheckbox_control?: string;
    formItemCheckbox_defaultValueIndicator?: string;
    formItemCheckbox_label?: string;
    formItemCheckbox_input?: string;
    formItemCheckbox_invalidMessage?: string;
    formItemCheckbox_softRemove?: string;
    formItemCheckbox_softRemoveInput?: string;
}

/* tslint:disable-next-line */
export interface FormItemCheckboxProps extends FormItemCommon {}
