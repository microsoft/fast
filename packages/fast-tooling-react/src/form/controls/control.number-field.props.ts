import { CommonFormControlProps } from "./control.props";

/**
 * Number field class name contract
 */
export interface NumberFieldClassNameContractFormControl {
    numberFieldFormControl?: string;
    numberFieldFormControl_badge?: string;
    numberFieldFormControl_control?: string;
    numberFieldFormControl_controlLabel?: string;
    numberFieldFormControl_controlLabelRegion?: string;
    numberFieldFormControl_controlInput?: string;
    numberFieldFormControl_defaultValueIndicator?: string;
    numberFieldFormControl__disabled?: string;
    numberFieldFormControl_softRemove?: string;
    numberFieldFormControl_softRemoveInput?: string;
    numberFieldFormControl_invalidMessage?: string;
    numberFieldFormControl_controlRegion?: string;
}

export interface NumberFieldPropsFormControl extends CommonFormControlProps {
    /**
     * The minimum value allowed
     */
    min?: number;

    /**
     * The maximum value allowed
     */
    max?: number;

    /**
     * The increment between steps
     */
    step?: number;
}
