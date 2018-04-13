import * as React from "react";
import Foundation, { HandledProps } from "../foundation";
import {get} from "lodash-es";
import { IContextMenuItemClassNameContract } from "@microsoft/fast-components-class-name-contracts";
import {
    ContextMenuItemProps,
    IContextMenuItemHandledProps,
    IContextMenuItemManagedClasses,
    IContextMenuItemUnhandledProps,
} from "./context-menu-item.props";
import {MenuItemRole} from "../utilities/aria";


class ContextMenuItem extends Foundation<IContextMenuItemHandledProps & IContextMenuItemManagedClasses, IContextMenuItemUnhandledProps, {}> {
    public readonly role: string = MenuItemRole.menuitem;

    protected handledProps: HandledProps<IContextMenuItemHandledProps & IContextMenuItemManagedClasses> = {
        managedClasses: void 0,
        children: void 0,
        id: void 0
    };

    /**
     * Renders the component
     */
    public render(): React.ReactElement<HTMLLIElement> {
        return (
            <li
                {...this.unhandledProps()}
                id={this.props.id}
                className={this.generateClassNames()}
                role={this.role}
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
export {IContextMenuItemClassNameContract};
