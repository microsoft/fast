import { CommonControlConfig, DragState } from "../templates";
import { FormChildOptionItem } from "../types";
import { UpdateSectionConfig } from "../templates/types";

export interface ChildrenControlOptions extends CommonControlConfig {
    /**
     * The potential children to be added
     */
    childOptions?: FormChildOptionItem[];

    /**
     * The default children to be added
     */
    defaultChildOptions?: string[];

    /**
     * The update section callback
     */
    onUpdateSection?: (config: UpdateSectionConfig) => void;
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

/* tslint:disable-next-line */
export interface ChildrenControlProps extends ChildrenControlOptions {}

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
