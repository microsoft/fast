import React from "react";
import Foundation, {
    FoundationProps,
    HandledProps,
} from "@microsoft/fast-components-foundation-react";
import {
    MenuItem,
    NavigationMenuHandledProps,
    NavigationMenuProps,
    NavigationMenuUnhandledProps,
} from "./navigation-menu.props";
import NavigationMenuItem from "./navigation-menu-item";
import { get } from "lodash-es";

export default class NavigationMenu extends Foundation<
    NavigationMenuHandledProps,
    NavigationMenuUnhandledProps,
    {}
> {
    public static displayName: string = "NavigationMenu";

    public render(): React.ReactNode {
        return (
            <nav className={this.generateClassNames()}>
                {this.renderNavigationMenuItem(this.props.menu)}
            </nav>
        );
    }

    protected generateClassNames(): string {
        const classes: string = get(this.props, "managedClasses.navigationMenu");

        return super.generateClassNames(classes);
    }

    private renderNavigationMenuItem(menu: MenuItem[]): React.ReactNode {
        return menu.map((menuItem: MenuItem, index: number) => {
            return (
                <NavigationMenuItem
                    key={index}
                    managedClasses={this.props.managedClasses}
                    expanded={this.props.expanded}
                    onLocationUpdate={this.props.onLocationUpdate}
                    activeLocation={this.props.activeLocation}
                    {...menuItem}
                />
            );
        });
    }
}
