import { CommonFormControlProps } from "./control.props";

/**
 * Display class name contract
 */
export interface DisplayFormControlClassNameContract {
    displayFormControl?: string;
    displayFormControl__disabled?: string;
    displayFormControl_badge?: string;
    displayFormControl_constValueIndicator?: string;
    displayFormControl_control?: string;
    displayFormControl_controlRegion?: string;
    displayFormControl_controlLabel?: string;
    displayFormControl_controlLabelRegion?: string;
    displayFormControl_controlInput?: string;
    displayFormControl_defaultValueIndicator?: string;
    displayFormControl_softRemove?: string;
    displayFormControl_softRemoveInput?: string;
    displayFormControl_invalidMessage?: string;
}

/* tslint:disable-next-line */
export interface DisplayFormControlProps extends CommonFormControlProps {}
