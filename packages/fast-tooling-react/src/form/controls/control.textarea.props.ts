import { CommonFormControlProps } from "./control.props";

/**
 * Textarea class name contract
 */
export interface TextareaFormControlClassNameContract {
    textareaFormControl?: string;
    textareaFormControl__disabled?: string;
    textareaFormControl_badge?: string;
    textareaFormControl_control?: string;
    textareaFormControl_controlRegion?: string;
    textareaFormControl_controlLabel?: string;
    textareaFormControl_controlLabelRegion?: string;
    textareaFormControl_controlTextarea?: string;
    textareaFormControl_defaultValueIndicator?: string;
    textareaFormControl_invalidMessage?: string;
    textareaFormControl_softRemove?: string;
    textareaFormControl_softRemoveInput?: string;
}

export interface TextareaFormControlProps extends CommonFormControlProps {
    /**
     * The unique index for the section
     */
    index: number;

    /**
     * The number of rows to assign to the textarea
     */
    rows?: number;
}
