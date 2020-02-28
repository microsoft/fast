import { DataType } from "../data-utilities/types";

export interface TreeNavigation {
    /**
     * A dictionary of items
     */
    [key: string]: TreeNavigationItem;
}

export interface ParentDictionaryItem {
    /**
     * The dictionary ID
     */
    id: string;

    /**
     * The data location from the dictionary item
     */
    dataLocation: string;
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
    parentDictionaryItem?: ParentDictionaryItem;

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

export interface TreeNavigationConfig {
    /**
     * The component schemas tree navigation
     */
    0: TreeNavigation;

    /**
     * The id for the root component
     */
    1: string;
}

export interface TreeNavigationConfigResolver {
    /**
     * The root level tree navigation
     */
    0: TreeNavigationConfig;

    /**
     * Additional tree navigation to add to the dictionary
     */
    1: { [key: string]: TreeNavigationConfig };
}

export interface TreeNavigationConfigDictionary {
    /**
     * The dictionary of tree navigation configs
     */
    0: { [key: string]: TreeNavigationConfig };

    /**
     * The key of the root tree navigation config
     */
    1: string;
}
