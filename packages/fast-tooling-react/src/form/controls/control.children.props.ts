import { ChildrenControlConfig, DragState } from "../templates";
import { FormChildOptionItem } from "../form.props";

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

/* tslint:disable-next-line */
export interface ChildrenControlProps extends ChildrenControlConfig {}

export enum Action {
    add = "add",
    edit = "edit",
    delete = "delete",
}

/**
 * State object for the ChildrenControl component
 */
export interface ChildrenControlState extends DragState {
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
