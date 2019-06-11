import FormItemCommon from "./form-item.props";

/**
 * Button class name contract
 */
export interface FormItemButtonClassNameContract {
    formItemButton?: string;
    formItemButton__disabled?: string;
    formItemButton_badge?: string;
    formItemButton_control?: string;
    formItemButton_controlRegion?: string;
    formItemButton_controlLabel?: string;
    formItemButton_controlLabelRegion?: string;
    formItemButton_controlInput?: string;
    formItemButton_defaultValueIndicator?: string;
    formItemButton_softRemove?: string;
    formItemButton_softRemoveInput?: string;
    formItemButton_invalidMessage?: string;
}

/* tslint:disable-next-line */
export interface FormItemButtonProps extends FormItemCommon {}
