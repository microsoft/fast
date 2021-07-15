import React from "react";
import { get, uniqueId } from "lodash-es";
import Foundation from "@microsoft/fast-components-foundation-react";
export default class NavigationMenuItem extends Foundation {
    constructor(props) {
        super(props);
        this.id = uniqueId("navigationMenu");
        this.handleMenuTriggerClick = () => {
            this.setState({
                expanded: !this.state.expanded,
            });
            const location = this.props.location;
            if (
                typeof location === "string" &&
                typeof this.props.onLocationUpdate === "function"
            ) {
                this.props.onLocationUpdate(location);
            }
        };
        this.handleLocationUpdate = () => {
            this.props.onLocationUpdate(this.props.location);
        };
        this.state = {
            expanded: this.props.expanded || false,
        };
    }
    static getDerivedStateFromProps(nextProps, prevState) {
        if (
            nextProps.expanded !== prevState.expanded &&
            typeof nextProps.expanded === "boolean"
        ) {
            return {
                expanded: nextProps.expanded,
            };
        }
        return null;
    }
    render() {
        return (
            <div className={this.generateClassNames()}>
                {this.renderMenuItemDisplayName()}
                {this.renderMenu()}
            </div>
        );
    }
    generateClassNames() {
        const classes = get(this.props, "managedClasses.navigationMenuItem");
        return super.generateClassNames(classes);
    }
    renderMenuItemDisplayName() {
        const items = this.props.items;
        if (Array.isArray(items) && items.length > 0) {
            return (
                <button
                    onClick={this.handleMenuTriggerClick}
                    aria-expanded={this.state.expanded}
                    aria-controls={this.id}
                    className={this.generateListItemClassNames()}
                >
                    {this.props.displayName}
                </button>
            );
        } else if (typeof this.props.onLocationUpdate === "function") {
            return (
                <button
                    onClick={this.handleLocationUpdate}
                    aria-controls={this.id}
                    role={"menuitem"}
                    className={this.generateListItemClassNames()}
                >
                    {this.props.displayName}
                </button>
            );
        }
        return (
            <a
                href={this.props.location}
                role={"menuitem"}
                className={this.generateListItemClassNames()}
            >
                {this.props.displayName}
            </a>
        );
    }
    renderMenu() {
        const items = this.props.items;
        if (Array.isArray(items) && items.length > 0) {
            return (
                <div
                    id={this.id}
                    className={this.generateMenuItemListClassNames()}
                    role={"menu"}
                >
                    {this.renderMenuItem(items)}
                </div>
            );
        }
    }
    renderMenuItem(items) {
        return items.map((menuItem, index) => {
            return (
                <NavigationMenuItem
                    key={index}
                    managedClasses={this.props.managedClasses}
                    expanded={this.props.expanded}
                    activeLocation={this.props.activeLocation}
                    onLocationUpdate={this.props.onLocationUpdate}
                    {...menuItem}
                />
            );
        });
    }
    generateListItemClassNames() {
        let classes = get(this.props, "managedClasses.navigationMenuItem_listItem", "");
        const location = this.props.location;
        if (
            typeof this.props.activeLocation !== "undefined" &&
            location === this.props.activeLocation
        ) {
            classes += ` ${get(
                this.props,
                "managedClasses.navigationMenuItem_listItem__active",
                ""
            )}`;
        }
        return classes;
    }
    generateMenuItemListClassNames() {
        let classes = get(this.props, "managedClasses.navigationMenuItem_list", "");
        if (this.state.expanded) {
            classes += ` ${get(
                this.props,
                "managedClasses.navigationMenuItem_list__expanded",
                ""
            )}`;
        }
        return classes;
    }
}
NavigationMenuItem.displayName = "NavigationMenuItem";
NavigationMenuItem.defaultProps = {
    activeLocation: void 0,
    expanded: void 0,
    displayName: void 0,
    items: void 0,
    location: void 0,
    onLocationUpdate: void 0,
};
export * from "./navigation-menu-item.props";
