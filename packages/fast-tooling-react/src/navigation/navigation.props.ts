import { ManagedClasses } from "@microsoft/fast-components-class-name-contracts-base";
import { NavigationClassNameContract } from "./navigation.style";
import {
    Data,
    DataDictionary,
    LinkedData,
    MessageSystem,
    SchemaDictionary,
    TreeNavigationConfigDictionary,
} from "@microsoft/fast-tooling";

export enum NavigationDataType {
    object = "object",
    array = "array",
    children = "children",
    component = "component",
    primitiveChild = "primitiveChild",
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
     * Expanded navigation config items
     */
    expandedNavigationConfigItems: { [key: string]: string[] };

    /**
     * The navigation dictionary
     */
    navigationDictionary: TreeNavigationConfigDictionary | null;

    /**
     * The dragging navigation dictionary
     */
    updatedNavigationDictionary: TreeNavigationConfigDictionary | null;

    /**
     * The data dictionary
     */
    dataDictionary: DataDictionary<unknown>;

    /**
     * The schema to map to the message system
     */
    schemaDictionary: SchemaDictionary;

    /**
     * The dragging state
     */
    isDragging: boolean;

    /**
     * The linked data currently being dragged
     */
    linkedData: Data<unknown>;

    /**
     * The linked datas original location
     */
    originalLinkedDataLocation: {
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
     * The linked datas new location
     */
    updatedLinkedDataLocation: {
        /**
         * Dictionary key
         */
        0: string;

        /**
         * Navigation config key
         */
        1: string;
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

    /**
     * If navigation items should enable drag to re-order. For this to work,
     * the parent application will need to ensure the Navigation component is
     * wrapped with a react-dnd backend. For more information on react-dnd backends,
     * see http://react-dnd.github.io/react-dnd/docs/overview
     */
    dragAndDropReordering?: boolean;
}

export type NavigationProps = NavigationHandledProps;
