import { CommonFormControlProps } from "./control.props";

/**
 * Checkbox class name contract
 */
export interface CheckboxFormControlClassNameContract {
    checkboxFormControl?: string;
    checkboxFormControl__disabled?: string;
    checkboxFormControl_badge?: string;
    checkboxFormControl_control?: string;
    checkboxFormControl_defaultValueIndicator?: string;
    checkboxFormControl_label?: string;
    checkboxFormControl_input?: string;
    checkboxFormControl_invalidMessage?: string;
    checkboxFormControl_softRemove?: string;
    checkboxFormControl_softRemoveInput?: string;
}

/* tslint:disable-next-line */
export interface CheckboxFormControlProps extends CommonFormControlProps {}
