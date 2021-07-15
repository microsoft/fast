import React from "react";
import Foundation from "@microsoft/fast-components-foundation-react";
import {
    NavigationMenuHandledProps,
    NavigationMenuUnhandledProps,
} from "./navigation-menu.props";
export default class NavigationMenu extends Foundation<
    NavigationMenuHandledProps,
    NavigationMenuUnhandledProps,
    {}
> {
    static displayName: string;
    render(): React.ReactNode;
    protected generateClassNames(): string;
    private renderNavigationMenuItem;
}
