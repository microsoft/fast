import { ManagedClasses } from "@microsoft/fast-jss-manager-react";
import { MenuItem } from "./navigation-menu.props";

export interface NavigationMenuItemClassNameContract {
    navigationMenuItem?: string;
    navigationMenuItem_list?: string;
    navigationMenuItem_list__expanded?: string;
    navigationMenuItem_listItem?: string;
    navigationMenuItem_listItem__active?: string;
}

export interface NavigationMenuItemState {
    expanded: boolean;
}

export type NavigationMenuItemUnhandledProps = React.HTMLAttributes<HTMLElement>;

export interface NavigationMenuItemHandledProps
    extends ManagedClasses<NavigationMenuItemClassNameContract>,
        MenuItem {
    /**
     * The expanded option that will determine
     * if the sub menus can be controlled
     */
    expanded?: boolean;

    /**
     * The active location used to determine active states
     */
    activeLocation?: string;

    /**
     * The callback invoked when clicking any menu item which has a location
     */
    onLocationUpdate?: (location: string) => void;
}

export type NavigationMenuItemProps = NavigationMenuItemUnhandledProps &
    NavigationMenuItemHandledProps;
