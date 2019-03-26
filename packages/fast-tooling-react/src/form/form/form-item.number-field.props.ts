import FormItemCommon from "./form-item.props";

/**
 * Number field class name contract
 */
export interface FormItemNumberFieldClassNameContract {
    formItemNumberField?: string;
    formItemNumberField_badge?: string;
    formItemNumberField_control?: string;
    formItemNumberField_controlLabel?: string;
    formItemNumberField_controlLabelRegion?: string;
    formItemNumberField_controlInput?: string;
    formItemNumberField__disabled?: string;
    formItemNumberField_softRemove?: string;
    formItemNumberField_softRemoveInput?: string;
    formItemNumberField_invalidMessage?: string;
    formItemNumberField_controlRegion?: string;
}

export interface FormItemNumberFieldProps extends FormItemCommon {
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
