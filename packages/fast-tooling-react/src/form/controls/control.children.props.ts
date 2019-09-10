import { updateActiveSection } from "../form-section.props";
import { CommonFormControlProps } from "./control.props";
import { DataOnChange, FormChildOptionItem } from "../form.props";
import { DragState } from "./drag-item.props";

/**
 * Children class name contract
 */
export interface ChildrenFormControlClassNameContract {
    childrenFormControl?: string;
    childrenFormControl_badge?: string;
    childrenFormControl_control?: string;
    childrenFormControl_controlLabel?: string;
    childrenFormControl_controlLabelRegion?: string;
    childrenFormControl_defaultValueIndicator?: string;
    childrenFormControl_existingChildren?: string;
    childrenFormControl_existingChildrenItem?: string;
    childrenFormControl_existingChildrenItem__default?: string;
    childrenFormControl_existingChildrenItem__sorting?: string;
    childrenFormControl_existingChildrenItemLink?: string;
    childrenFormControl_existingChildrenItemContent?: string;
    childrenFormControl_existingChildrenItemName?: string;
    childrenFormControl_childrenList?: string;
    childrenFormControl_childrenListControl?: string;
    childrenFormControl_childrenListInput?: string;
    childrenFormControl_childrenListItem?: string;
    childrenFormControl_childrenListTrigger?: string;
    childrenFormControl_delete?: string;
    childrenFormControl_deleteButton?: string;
}

export interface ChildComponentDataMapping {
    [T: string]: any;
}

export interface ChildComponentConfig {
    /**
     * The JSON schema id for the component
     */
    id: string;

    /**
     * The props for the component
     */
    props: ChildComponentDataMapping;
}

export type ChildComponent = ChildComponentConfig | string;

export interface ChildrenFormControlProps extends CommonFormControlProps {
    /**
     * The onChange event
     */
    onChange: DataOnChange;

    /**
     * The callback for activating a subcomponent
     */
    onUpdateActiveSection: updateActiveSection;

    /**
     * The potential children to be added
     */
    childOptions: FormChildOptionItem[];

    /**
     * The default children to be added
     */
    defaultChildOptions?: string[];
}

export enum Action {
    add = "add",
    edit = "edit",
    delete = "delete",
}

/**
 * State object for the ChildrenFormControl component
 */
export interface ChildrenFormControlState extends DragState {
    childrenSearchTerm: string;
    indexOfSelectedFilteredChildOption: number;
    filteredChildOptions: FormChildOptionItem[];
    hideChildrenList: boolean;
    /**
     * The child item to move the editor too on
     * the next render
     */
    editChildIndex: number;
}
