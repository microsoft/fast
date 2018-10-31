import * as React from "react";
import Foundation, { HandledProps } from "@microsoft/fast-components-foundation-react";
import { get } from "lodash-es";
import { ContextMenuItemClassNameContract } from "@microsoft/fast-components-class-name-contracts-base";
import {
    ContextMenuItemHandledProps,
    ContextMenuItemProps,
    ContextMenuItemUnhandledProps,
} from "./context-menu-item.props";

export enum ContextMenuItemRole {
    menuItem = "menuitem",
    menuItemRadio = "menuitemradio",
    menuItemCheckbox = "menuitemcheckbox",
}

class ContextMenuItem extends Foundation<
    ContextMenuItemHandledProps,
    ContextMenuItemUnhandledProps,
    {}
> {
    public static displayName: string = "ContextMenuItem";

    public static defaultProps: Partial<ContextMenuItemProps> = {
        role: ContextMenuItemRole.menuItem,
        disabled: false,
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
                aria-disabled={this.props.disabled || undefined}
            >
                {this.props.children}
            </div>
        );
    }

    /**
     * Create class-names
     */
    protected generateClassNames(): string {
        let className: string = get(this.props.managedClasses, "contextMenuItem") || "";

        switch (this.props.role) {
            case ContextMenuItemRole.menuItemCheckbox:
                className = className.concat(
                    " ",
                    get(this.props.managedClasses, "contextMenuItem__checkbox")
                );
                break;
            case ContextMenuItemRole.menuItemRadio:
                className = className.concat(
                    " ",
                    get(this.props.managedClasses, "contextMenuItem__radio")
                );
                break;
        }

        if (this.props.disabled) {
            className = className.concat(
                " ",
                get(this.props.managedClasses, "contextMenuItem__disabled")
            );
        }

        return super.generateClassNames(className);
    }
}

export default ContextMenuItem;
export * from "./context-menu-item.props";
export { ContextMenuItemClassNameContract };
