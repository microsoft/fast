import { DragState, LinkedDataControlConfig } from "../templates";

export interface ChildComponentDataMapping {
    [T: string]: any;
}

/* tslint:disable-next-line */
export interface LinkedDataControlProps extends LinkedDataControlConfig {}

export enum Action {
    add = "add",
    edit = "edit",
    delete = "delete",
}

/**
 * State object for the LinkedDataControl component
 */
export interface LinkedDataControlState extends DragState {
    /**
     * The search term used to filter a list of linked data
     */
    searchTerm: string;
}
