import FormItemCommon from "./form-item.props";
import { updateActiveSection } from "./form-section.props";

/**
 * Array class name contract
 */
export interface FormItemArrayClassNameContract {
    formItemArray?: string;
    formItemArray_badge?: string;
    formItemArray_control?: string;
    formItemArray_controlAddButton?: string;
    formItemArray_controlLabel?: string;
    formItemArray_controlLabelRegion?: string;
    formItemArray_controlRegion?: string;
    formItemArray_existingItemList?: string;
    formItemArray_existingItemListItem?: string;
    formItemArray_existingItemListItem__sorting?: string;
    formItemArray_existingItemListItemLink?: string;
    formItemArray_existingItemRemoveButton?: string;
    formItemArray_invalidMessage?: string;
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
     * The schema
     */
    schema: any;

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
