import { CommonFormControlProps } from "./control.props";
import { updateActiveSection } from "../form-section.props";
import { DragState } from "./drag-item.props";

/**
 * Array class name contract
 */
export interface ArrayFormControlClassNameContract {
    arrayFormControl?: string;
    arrayFormControl_addItem?: string;
    arrayFormControl_addItemButton?: string;
    arrayFormControl_addItemLabel?: string;
    arrayFormControl_badge?: string;
    arrayFormControl_control?: string;
    arrayFormControl_controlLabel?: string;
    arrayFormControl_controlLabel__invalid?: string;
    arrayFormControl_controlLabelRegion?: string;
    arrayFormControl_controlRegion?: string;
    arrayFormControl_defaultValueIndicator?: string;
    arrayFormControl_existingItemList?: string;
    arrayFormControl_existingItemListItem?: string;
    arrayFormControl_existingItemListItem__sorting?: string;
    arrayFormControl_existingItemListItemLink?: string;
    arrayFormControl_existingItemListItemLink__default?: string;
    arrayFormControl_existingItemRemoveButton?: string;
    arrayFormControl_invalidMessage?: string;
    arrayFormControl_softRemove?: string;
    arrayFormControl_softRemoveInput?: string;
}

export enum ItemConstraints {
    minItems = "minItems",
    maxItems = "maxItems",
}

export interface ArrayFormControlProps extends CommonFormControlProps {
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

/* tslint:disable */
export interface ArrayFormControlState extends DragState {}
