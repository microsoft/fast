import { ManagedClasses } from "@microsoft/fast-components-class-name-contracts-base";
import { ChildOptionItem } from "../data-utilities";
import { NavigationClassNameContract } from "./navigation.style";

export enum NavigationDataType {
    object = "object",
    array = "array",
    children = "children",
    childrenItem = "childrenItem",
}

export interface NavigationState {
    /**
     * The navigation data
     */
    navigation: TreeNavigation;

    /**
     * The open items tracked by data location
     */
    openItems: string[];

    /**
     * The current active item
     */
    activeItem: null | string;

    /**
     * The hovered tree item
     */
    dragHoverDataLocation: null | string;

    /**
     * The hovered location before
     */
    dragHoverBeforeDataLocation: null | string;

    /**
     * The hovered location after
     */
    dragHoverAfterDataLocation: null | string;
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

export interface NavigationUnhandledProps extends React.HTMLAttributes<HTMLDivElement> {}

export interface NavigationHandledProps
    extends ManagedClasses<NavigationClassNameContract> {
    /**
     * The JSON schema
     */
    schema: any;

    /**
     * The data mapped to the schema
     */
    data: any;

    /**
     * The React child options
     */
    childOptions?: ChildOptionItem[];

    /**
     * The data location if the component is controlled
     */
    dataLocation?: string;

    /**
     * The location update
     */
    onLocationUpdate?: (dataLocation: string) => void;

    /**
     * If navigation items should enable drag to re-order. For this to work,
     * the parent application will need to ensure the Navigation component is
     * wrapped with a react-dnd backend. For more information on react-dnd backends,
     * see http://react-dnd.github.io/react-dnd/docs/overview
     */
    dragAndDropReordering?: boolean;

    /**
     * The onChange callback for updating the data
     */
    onChange?: (data: any) => void;
}

export type NavigationProps = NavigationHandledProps & NavigationUnhandledProps;
