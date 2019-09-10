import { CommonFormControlProps } from "./control.props";
import { updateActiveSection } from "../form-section.props";
import { FormChildOptionItem } from "../form.props";

/**
 * Display class name contract
 */
export interface DictionaryFormControlClassNameContract {
    dictionaryFormControl?: string;
    dictionaryFormControl_control?: string;
    dictionaryFormControl_controlRegion?: string;
    dictionaryFormControl_controlLabel?: string;
    dictionaryFormControl_controlAddTrigger?: string;
    dictionaryFormControl_itemControl?: string;
    dictionaryFormControl_itemControlLabel?: string;
    dictionaryFormControl_itemControlRegion?: string;
    dictionaryFormControl_itemControlInput?: string;
    dictionaryFormControl_itemControlRemoveTrigger?: string;
}

export interface DictionaryFormControlProps extends CommonFormControlProps {
    /**
     * The untitled string for missing titles
     */
    untitled: string;

    /**
     * The schema location (lodash path syntax)
     */
    schemaLocation: string;

    /**
     * The possible child options
     */
    childOptions: FormChildOptionItem[];

    /**
     * A list of enumerated properties that should be excluded from
     * the dictionary
     */
    enumeratedProperties: string[];

    /**
     * The section update callback
     */
    onUpdateActiveSection: updateActiveSection;
}

export interface DictionaryFormControlState {
    /**
     * The current property key being edited
     */
    focusedPropertyKey: string | null;

    /**
     * The current property key value
     */
    focusedPropertyKeyValue: string | null;
}
