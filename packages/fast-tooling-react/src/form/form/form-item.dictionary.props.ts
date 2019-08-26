import FormItemCommon from "./form-item.props";
import { updateActiveSection } from "./form-section.props";
import { FormChildOptionItem } from "./form.props";

/**
 * Display class name contract
 */
export interface FormItemDictionaryClassNameContract {
    formItemDictionary?: string;
    formItemDictionary_control?: string;
    formItemDictionary_controlRegion?: string;
    formItemDictionary_controlLabel?: string;
    formItemDictionary_controlAddTrigger?: string;
    formItemDictionary_itemControl?: string;
    formItemDictionary_itemControlLabel?: string;
    formItemDictionary_itemControlRegion?: string;
    formItemDictionary_itemControlInput?: string;
    formItemDictionary_itemControlRemoveTrigger?: string;
}

export interface FormItemDictionaryProps extends FormItemCommon {
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

export interface FormItemDictionaryState {
    /**
     * The current property key being edited
     */
    focusedPropertyKey: string | null;

    /**
     * The current property key value
     */
    focusedPropertyKeyValue: string | null;
}
