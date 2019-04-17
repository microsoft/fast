import { updateActiveSection } from "./form-section.props";
import FormItemCommon from "./form-item.props";
import { DataOnChange, FormChildOptionItem } from "./form.props";

/**
 * Children class name contract
 */
export interface FormItemChildrenClassNameContract {
    formItemChildren?: string;
    formItemChildren_badge?: string;
    formItemChildren_control?: string;
    formItemChildren_controlLabel?: string;
    formItemChildren_controlLabelRegion?: string;
    formItemChildren_defaultValueIndicator?: string;
    formItemChildren_existingChildren?: string;
    formItemChildren_existingChildrenItem?: string;
    formItemChildren_existingChildrenItem__default?: string;
    formItemChildren_existingChildrenItem__sorting?: string;
    formItemChildren_existingChildrenItemLink?: string;
    formItemChildren_existingChildrenItemContent?: string;
    formItemChildren_existingChildrenItemName?: string;
    formItemChildren_childrenList?: string;
    formItemChildren_childrenListControl?: string;
    formItemChildren_childrenListInput?: string;
    formItemChildren_childrenListItem?: string;
    formItemChildren_childrenListTrigger?: string;
    formItemChildren_delete?: string;
    formItemChildren_deleteButton?: string;
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

export interface FormItemChildrenProps extends FormItemCommon {
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
 * State object for the FormItemChildren component
 */
export interface FormItemChildrenState {
    childrenSearchTerm: string;
    indexOfSelectedFilteredChildOption: number;
    filteredChildOptions: FormChildOptionItem[];
    hideChildrenList: boolean;
}
