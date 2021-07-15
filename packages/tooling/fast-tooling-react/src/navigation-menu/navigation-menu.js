import React from "react";
import Foundation from "@microsoft/fast-components-foundation-react";
import NavigationMenuItem from "./navigation-menu-item";
import { get } from "lodash-es";
export default class NavigationMenu extends Foundation {
    render() {
        return (
            <nav className={this.generateClassNames()}>
                {this.renderNavigationMenuItem(this.props.menu)}
            </nav>
        );
    }
    generateClassNames() {
        const classes = get(this.props, "managedClasses.navigationMenu");
        return super.generateClassNames(classes);
    }
    renderNavigationMenuItem(menu) {
        return menu.map((menuItem, index) => {
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
NavigationMenu.displayName = "NavigationMenu";
