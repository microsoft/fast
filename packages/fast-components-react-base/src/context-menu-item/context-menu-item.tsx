import * as React from "react";
import Foundation, { HandledProps } from "@microsoft/fast-components-foundation-react";
import { get } from "lodash-es";
import { ContextMenuItemClassNameContract } from "@microsoft/fast-components-class-name-contracts-base";
import {
    ContextMenuItemHandledProps,
    ContextMenuItemManagedClasses,
    ContextMenuItemProps,
    ContextMenuItemUnhandledProps,
} from "./context-menu-item.props";
import { MenuItemRole } from "../utilities/aria";

export enum ContextMenuItemRole {
    menuitem = "menuitem"
}

class ContextMenuItem extends Foundation<ContextMenuItemHandledProps, ContextMenuItemUnhandledProps, {}> {
    public deafultProps: Partial<ContextMenuItemProps> = {
        role: ContextMenuItemRole.menuitem
    };

    protected handledProps: HandledProps<ContextMenuItemHandledProps> = {
        managedClasses: void 0,
        children: void 0,
    };

    /**
     * Renders the component
     */
    public render(): React.ReactElement<HTMLLIElement> {
        return (
            <li
                {...this.unhandledProps()}
                className={this.generateClassNames()}
                role={this.props.role}
            >
                {this.props.children}
            </li>
        );
    }

    /**
     * Create class-names
     */
    protected generateClassNames(): string {
        return super.generateClassNames(get(this.props.managedClasses, "contextMenuItem"));
    }
}

export default ContextMenuItem;
export * from "./context-menu-item.props";
export {ContextMenuItemClassNameContract};
