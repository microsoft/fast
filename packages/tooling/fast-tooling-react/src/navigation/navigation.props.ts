import {
    Data,
    DataDictionary,
    MessageSystem,
    NavigationConfigDictionary,
} from "@microsoft/fast-tooling";
import { DragDropItemType } from "./navigation-tree-item.props";

export enum NavigationDataType {
    object = "object",
    array = "array",
    children = "children",
    component = "component",
    primitiveChild = "primitiveChild",
}

export enum HoverLocation {
    before = "before",
    after = "after",
}

export interface NavigationState {
    /**
     * The current active item
     */
    activeItem: {
        /**
         * Dictionary key
         */
        0: string;

        /**
         * Navigation config key
         */
        1: string;
    } | null;

    /**
     * Whether the current active item is editable
     */
    activeItemEditable: boolean;

    /**
     * Expanded navigation config items
     */
    expandedNavigationConfigItems: { [key: string]: string[] };

    /**
     * The navigation dictionary
     */
    navigationDictionary: NavigationConfigDictionary | null;

    /**
     * The data dictionary
     */
    dataDictionary: DataDictionary<unknown>;

    /**
     * The linked data currently being dragged
     */
    linkedData: Data<unknown>[];

    /**
     * The linked datas location
     */
    linkedDataLocation: {
        /**
         * Dictionary key
         */
        0: string;

        /**
         * Navigation config key
         */
        1: string;

        /**
         * The index
         */
        2: number;
    } | null;

    /**
     * The item being hovered
     */
    hoveredItem: {
        /**
         * The type of the hovered item
         */
        0: DragDropItemType;

        /**
         * The dictionary ID
         */
        1: string;

        /**
         * The navigation config ID
         */
        2: string;

        /**
         * The location of the hover
         */
        3: HoverLocation;
    } | null;
}

export interface TreeNavigation {
    /**
     * The navigation item text
     */
    text: string;

    /**
     * The data location of this item
     */
    dataLocation: string;

    /**
     * The data type, this will result in a different
     * icons used
     */
    type: NavigationDataType;

    /**
     * The items belonging to the text as a dropdown
     */
    items?: TreeNavigation[] | void;
}

export interface NavigationHandledProps {
    /**
     * The message system
     * used for sending and receiving data to the message system
     */
    messageSystem: MessageSystem;
}

export type NavigationProps = NavigationHandledProps;
