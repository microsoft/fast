import { DragState, LinkedDataControlConfig } from "../templates";
export interface ChildComponentDataMapping {
    [T: string]: any;
}
export declare type LinkedDataControlProps = LinkedDataControlConfig;
export declare enum Action {
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
