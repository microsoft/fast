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
    menuitem = "menuitem",
    menuitemradio = "menuitemradio",
    menuitemcheckbox = "menuitemcheckbox",
}

class ContextMenuItem extends Foundation<
    ContextMenuItemHandledProps,
    ContextMenuItemUnhandledProps,
    {}
> {
    public static defaultProps: Partial<ContextMenuItemProps> = {
        role: ContextMenuItemRole.menuitem,
    };

    protected handledProps: HandledProps<ContextMenuItemHandledProps> = {
        managedClasses: void 0,
        children: void 0,
    };

    /**
     * Renders the component
     */
    public render(): React.ReactElement<HTMLDivElement> {
        return (
            <div
                {...this.unhandledProps()}
                className={this.generateClassNames()}
                role={this.props.role}
            >
                {this.props.children}
            </div>
        );
    }

    /**
     * Create class-names
     */
    protected generateClassNames(): string {
        let className: string = get(this.props.managedClasses, "contextMenuItem");

        switch (this.props.role) {
            case ContextMenuItemRole.menuitemcheckbox:
                className = className.concat(
                    " ",
                    get(this.props.managedClasses, "contextMenuItem__checkbox")
                );
                break;
            case ContextMenuItemRole.menuitemradio:
                className = className.concat(
                    " ",
                    get(this.props.managedClasses, "contextMenuItem__radio")
                );
                break;
        }

        return super.generateClassNames(className);
    }
}

export default ContextMenuItem;
export * from "./context-menu-item.props";
export { ContextMenuItemClassNameContract };
