import FormItemCommon from "./form-item.props";

/**
 * Display class name contract
 */
export interface FormItemDisplayClassNameContract {
    formItemDisplay?: string;
    formItemDisplay__disabled?: string;
    formItemDisplay_badge?: string;
    formItemDisplay_constValueIndicator?: string;
    formItemDisplay_control?: string;
    formItemDisplay_controlRegion?: string;
    formItemDisplay_controlLabel?: string;
    formItemDisplay_controlLabelRegion?: string;
    formItemDisplay_controlInput?: string;
    formItemDisplay_defaultValueIndicator?: string;
    formItemDisplay_softRemove?: string;
    formItemDisplay_softRemoveInput?: string;
    formItemDisplay_invalidMessage?: string;
}

/* tslint:disable-next-line */
export interface FormItemDisplayProps extends FormItemCommon {}
