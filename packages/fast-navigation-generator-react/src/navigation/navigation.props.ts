import { ChildOptionItem } from "@microsoft/fast-data-utilities-react";
import { ManagedClasses } from "@microsoft/fast-components-class-name-contracts-base";
import { NavigationClassNameContract } from "./navigation.style";

export interface NavigationState {
    /**
     * The navigation data
     */
    navigation: TreeNavigation[];

    /**
     * The open items tracked by data location
     */
    openItems: string[];

    /**
     * The current active item
     */
    activeItem: null | string;
}

/**
 * The type of item for the list item icon
 */
export enum ItemType {
    children = "children",
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
    type: ItemType;

    /**
     * The items belonging to the text as a dropdown
     */
    items?: TreeNavigation[];
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
     * The location update
     */
    onLocationUpdate?: (dataLocation: string) => void;
}

export type NavigationProps = NavigationHandledProps & NavigationUnhandledProps;
