import { DataType } from "../data-utilities/types";
import { Parent } from "./data.props";

export interface TreeNavigation {
    /**
     * A dictionary of items
     */
    [key: string]: TreeNavigationItem;
}

export interface TreeNavigationItem {
    /**
     * The ID for this item
     */
    self: string;

    /**
     * The ID for the parent of this item
     */
    parent: string | null;

    /**
     * The dictionary item that is the parent of this item
     */
    parentDictionaryItem?: Parent;

    /**
     * The relative data location
     */
    relativeDataLocation: string;

    /**
     * The schema location
     */
    schemaLocation: string;

    /**
     * The schema
     */
    schema: any;

    /**
     * The disabled state
     */
    disabled: boolean;

    /**
     * The data
     */
    data: any;

    /**
     * The display text
     */
    text: string;

    /**
     * The data type, this will result in a different
     * icons used
     */
    type: DataType;

    /**
     * The ids belonging to the text as a dropdown
     */
    items: string[];
}

export interface NavigationConfig {
    /**
     * The component schemas tree navigation
     */
    0: TreeNavigation;

    /**
     * The id for the root component
     */
    1: string;
}

export interface NavigationConfigResolver {
    /**
     * The root level tree navigation
     */
    0: NavigationConfig;

    /**
     * Additional tree navigation to add to the dictionary
     */
    1: { [key: string]: NavigationConfig };
}

export interface NavigationConfigDictionary {
    /**
     * The dictionary of tree navigation configs
     */
    0: { [key: string]: NavigationConfig };

    /**
     * The key of the root tree navigation config
     */
    1: string;
}
