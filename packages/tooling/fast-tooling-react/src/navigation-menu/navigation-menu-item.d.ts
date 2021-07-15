import React from "react";
import Foundation from "@microsoft/fast-components-foundation-react";
import {
    NavigationMenuItemHandledProps,
    NavigationMenuItemProps,
    NavigationMenuItemState,
    NavigationMenuItemUnhandledProps,
} from "./navigation-menu-item.props";
export default class NavigationMenuItem extends Foundation<
    NavigationMenuItemHandledProps,
    NavigationMenuItemUnhandledProps,
    NavigationMenuItemState
> {
    static displayName: string;
    static defaultProps: NavigationMenuItemHandledProps;
    static getDerivedStateFromProps(
        nextProps: NavigationMenuItemProps,
        prevState: NavigationMenuItemState
    ): null | Partial<NavigationMenuItemState>;
    private id;
    constructor(props: NavigationMenuItemProps);
    render(): React.ReactNode;
    protected generateClassNames(): string;
    private renderMenuItemDisplayName;
    private renderMenu;
    private renderMenuItem;
    private generateListItemClassNames;
    private generateMenuItemListClassNames;
    private handleMenuTriggerClick;
    private handleLocationUpdate;
}
export * from "./navigation-menu-item.props";
