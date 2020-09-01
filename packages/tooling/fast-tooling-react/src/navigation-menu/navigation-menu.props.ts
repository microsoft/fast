import { ManagedClasses } from "@microsoft/fast-jss-manager-react";
import { NavigationMenuClassNameContract } from "./navigation-menu.style";

export interface MenuItem {
    /**
     * The text used in the UI for the menu item
     */
    displayName: string;

    /**
     * The location, used as an href on a menu item leaf if the
     * onLocationUpdate callback has not been passed
     */
    location?: string;

    /**
     * The nested menu items associated with the menu
     */
    items?: MenuItem[];
}

export type NavigationMenuUnhandledProps = React.HTMLAttributes<HTMLElement>;

export interface NavigationMenuHandledProps
    extends ManagedClasses<NavigationMenuClassNameContract> {
    /**
     * The menu
     */
    menu: MenuItem[];

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

export type NavigationMenuProps = NavigationMenuUnhandledProps &
    NavigationMenuHandledProps;
