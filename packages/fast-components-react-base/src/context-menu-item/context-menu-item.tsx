import * as React from "react";
import Foundation, {HandledProps} from "../foundation";
import {IContextMenuItemClassNameContract} from "@microsoft/fast-components-class-name-contracts";
import {
    ContextMenuItemProps,
    IContextMenuItemHandledProps,
    IContextMenuItemManagedClasses,
    IContextMenuItemUnhandledProps,
} from "./context-menu-item.props";

export enum ContextMenuItemRole {
    menuitem = "menuitem",
    menuitemcheckbox = "menuitemcheckbox",
    menuitemradio = "menuitemradio"
}

/* tslint:disable-next-line */
class ContextMenuItem extends Foundation<IContextMenuItemHandledProps & IContextMenuItemManagedClasses, IContextMenuItemUnhandledProps, {}> {
    public static defaultProps: IContextMenuItemHandledProps = {
        role: ContextMenuItemRole.menuitem
    };

    protected handledProps: HandledProps<IContextMenuItemHandledProps & IContextMenuItemManagedClasses> = {
        managedClasses: void 0,
        children: void 0
    };

    /**
     * Renders the component
     */
    public render(): React.ReactElement<HTMLLIElement> {
        return (
            <li
                {...this.unhandledProps()}
                className={this.generateClassNames()}
                role={ContextMenuItemRole[this.props.role] || ContextMenuItem.defaultProps.role}
            >
                {this.props.children}
            </li>
        );
    }

    /**
     * Create class-names
     */
    protected generateClassNames(): string {
        return super.generateClassNames(this.props.managedClasses.contextMenuItem);
    }
}

export default ContextMenuItem;
export * from "./context-menu-item.props";
export {IContextMenuItemClassNameContract};
