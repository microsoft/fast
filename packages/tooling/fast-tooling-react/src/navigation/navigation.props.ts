import {
    Data,
    DataDictionary,
    DataType,
    MessageSystem,
    NavigationConfigDictionary,
} from "@microsoft/fast-tooling";
import { XOR } from "@microsoft/fast-tooling/dist/dts/data-utilities/type.utilities";
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
    center = "center",
    after = "after",
}

export interface LinkedDataLocationConfig {
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
}

export type LinkedDataLocation = XOR<LinkedDataLocationConfig, null>;

export interface HoveredItemConfig {
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
}

export type HoveredItem = XOR<HoveredItemConfig, null>;

interface TextEditing {
    /**
     * The dictionary ID of the current text being edited
     */
    dictionaryId: string;

    /**
     * The navigation config ID of the current text being edited
     */
    navigationConfigId: string;
}

export interface NavigationState {
    /**
     * The active dictionary ID
     */
    activeDictionaryId: string;

    /**
     * The active navigation config ID
     */
    activeNavigationConfigId: string;

    /**
     * The current item being edited
     */
    textEditing: XOR<null, TextEditing>;

    /**
     * Expanded navigation config items
     */
    expandedNavigationConfigItems: { [key: string]: Set<string> };

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
    linkedDataLocation: LinkedDataLocation;

    /**
     * The item being hovered
     */
    hoveredItem: HoveredItem;
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
     * The JSON schema types that will be visible
     */
    types?: DataType[];

    /**
     * The default data location to use if a linked data container is dropped on
     * @alpha
     */
    defaultLinkedDataDroppableDataLocation?: string;

    /**
     * An array of schema IDs that can't be dropped to
     * @alpha
     */
    droppableBlocklist?: string[];
}

export type NavigationProps = NavigationHandledProps;
