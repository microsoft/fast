import { CommonFormControlProps } from "./control.props";

/**
 * Button class name contract
 */
export interface ButtonFormControlClassNameContract {
    buttonFormControl?: string;
    buttonFormControl__disabled?: string;
    buttonFormControl_badge?: string;
    buttonFormControl_control?: string;
    buttonFormControl_controlRegion?: string;
    buttonFormControl_controlLabel?: string;
    buttonFormControl_controlLabelRegion?: string;
    buttonFormControl_controlInput?: string;
    buttonFormControl_defaultValueIndicator?: string;
    buttonFormControl_softRemove?: string;
    buttonFormControl_softRemoveInput?: string;
    buttonFormControl_invalidMessage?: string;
}

/* tslint:disable-next-line */
export interface ButtonFormControlProps extends CommonFormControlProps {}
