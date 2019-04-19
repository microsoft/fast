import FormItemCommon from "./form-item.props";
import { updateActiveSection } from "./form-section.props";

/**
 * Array class name contract
 */
export interface FormItemArrayClassNameContract {
    formItemArray?: string;
    formItemArray_addItem?: string;
    formItemArray_addItemButton?: string;
    formItemArray_addItemLabel?: string;
    formItemArray_badge?: string;
    formItemArray_control?: string;
    formItemArray_controlLabel?: string;
    formItemArray_controlLabel__invalid?: string;
    formItemArray_controlLabelRegion?: string;
    formItemArray_controlRegion?: string;
    formItemArray_defaultValueIndicator?: string;
    formItemArray_existingItemList?: string;
    formItemArray_existingItemListItem?: string;
    formItemArray_existingItemListItem__sorting?: string;
    formItemArray_existingItemListItemLink?: string;
    formItemArray_existingItemListItemLink__default?: string;
    formItemArray_existingItemRemoveButton?: string;
    formItemArray_invalidMessage?: string;
    formItemArray_softRemove?: string;
    formItemArray_softRemoveInput?: string;
}

export enum ItemConstraints {
    minItems = "minItems",
    maxItems = "maxItems",
}

export enum ArrayAction {
    add = "add",
    remove = "remove",
}

export interface FormItemArrayProps extends FormItemCommon {
    /**
     * The location of the schema
     */
    schemaLocation: string;

    /**
     * The location of the data
     */
    dataLocation: string;

    /**
     * The string to use for an untitled schema
     */
    untitled: string;

    /**
     * The callback to update a different active section and/or component
     */
    onUpdateActiveSection: updateActiveSection;
}
