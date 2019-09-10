import { CommonFormControlProps } from "./control.props";

/**
 * Select class name contract
 */
export interface SelectFormControlClassNameContract {
    selectFormControl?: string;
    selectFormControl__disabled?: string;
    selectFormControl_badge?: string;
    selectFormControl_control?: string;
    selectFormControl_controlLabel?: string;
    selectFormControl_controlLabelRegion?: string;
    selectFormControl_controlRegion?: string;
    selectFormControl_controlSpan?: string;
    selectFormControl_controlInput?: string;
    selectFormControl_defaultValueIndicator?: string;
    selectFormControl_invalidMessage?: string;
    selectFormControl_softRemove?: string;
    selectFormControl_softRemoveInput?: string;
}

/**
 * Select state interface
 */
export interface SelectFormControlProps extends CommonFormControlProps {
    /**
     * The select options
     */
    options: any[];
}
