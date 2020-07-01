import React from "react";
import { get, uniqueId } from "lodash-es";
import Foundation, {
    FoundationProps,
    HandledProps,
} from "@microsoft/fast-components-foundation-react";
import {
    NavigationMenuItemHandledProps,
    NavigationMenuItemProps,
    NavigationMenuItemState,
    NavigationMenuItemUnhandledProps,
} from "./navigation-menu-item.props";
import { MenuItem } from "./navigation-menu.props";

export default class NavigationMenuItem extends Foundation<
    NavigationMenuItemHandledProps,
    NavigationMenuItemUnhandledProps,
    NavigationMenuItemState
> {
    public static displayName: string = "NavigationMenuItem";

    public static defaultProps: NavigationMenuItemHandledProps = {
        activeLocation: void 0,
        expanded: void 0,
        displayName: void 0,
        items: void 0,
        location: void 0,
        onLocationUpdate: void 0,
    };

    public static getDerivedStateFromProps(
        nextProps: NavigationMenuItemProps,
        prevState: NavigationMenuItemState
    ): null | Partial<NavigationMenuItemState> {
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

    private id: string = uniqueId("navigationMenu");

    constructor(props: NavigationMenuItemProps) {
        super(props);

        this.state = {
            expanded: this.props.expanded || false,
        };
    }

    public render(): React.ReactNode {
        return (
            <div className={this.generateClassNames()}>
                {this.renderMenuItemDisplayName()}
                {this.renderMenu()}
            </div>
        );
    }

    protected generateClassNames(): string {
        const classes: string = get(this.props, "managedClasses.navigationMenuItem");

        return super.generateClassNames(classes);
    }

    private renderMenuItemDisplayName(): React.ReactNode {
        const items: MenuItem[] | void = this.props.items;

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

    private renderMenu(): React.ReactNode {
        const items: MenuItem[] | void = this.props.items;

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

    private renderMenuItem(items: MenuItem[]): React.ReactNode {
        return items.map(
            (menuItem: MenuItem, index: number): React.ReactNode => {
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
            }
        );
    }

    private generateListItemClassNames(): string {
        let classes: string = get(
            this.props,
            "managedClasses.navigationMenuItem_listItem",
            ""
        );
        const location: string = this.props.location;

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

    private generateMenuItemListClassNames(): string {
        let classes: string = get(
            this.props,
            "managedClasses.navigationMenuItem_list",
            ""
        );

        if (this.state.expanded) {
            classes += ` ${get(
                this.props,
                "managedClasses.navigationMenuItem_list__expanded",
                ""
            )}`;
        }

        return classes;
    }

    private handleMenuTriggerClick = (): void => {
        this.setState({
            expanded: !this.state.expanded,
        });

        const location: string | void = this.props.location;

        if (
            typeof location === "string" &&
            typeof this.props.onLocationUpdate === "function"
        ) {
            this.props.onLocationUpdate(location);
        }
    };

    private handleLocationUpdate = (): void => {
        this.props.onLocationUpdate(this.props.location);
    };
}

export * from "./navigation-menu-item.props";
