import React from "react";
import Foundation, { HandledProps } from "@microsoft/fast-components-foundation-react";
import { get } from "lodash-es";
import { ContextMenuItemClassNameContract } from "@microsoft/fast-components-class-name-contracts-base";
import { KeyCodes } from "@microsoft/fast-web-utilities";
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
        disabled: void 0,
        managedClasses: void 0,
        onInvoke: void 0,
        role: void 0,
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
                onKeyDown={this.handleMenuItemKeyDown}
                onClick={this.handleMenuItemClick}
            >
                {this.props.children}
            </div>
        );
    }

    /**
     * Create class-names
     */
    protected generateClassNames(): string {
        let className: string = get(this.props.managedClasses, "contextMenuItem", "");

        switch (this.props.role) {
            case ContextMenuItemRole.menuItemCheckbox:
                className = className.concat(
                    " ",
                    get(this.props.managedClasses, "contextMenuItem__checkbox", "")
                );
                break;
            case ContextMenuItemRole.menuItemRadio:
                className = className.concat(
                    " ",
                    get(this.props.managedClasses, "contextMenuItem__radio", "")
                );
                break;
        }

        if (this.props.disabled) {
            className = className.concat(
                " ",
                get(this.props.managedClasses, "contextMenuItem__disabled", "")
            );
        }

        return super.generateClassNames(className);
    }

    /**
     * Handle the keydown event of the item
     */
    private handleMenuItemKeyDown = (e: React.KeyboardEvent<HTMLDivElement>): void => {
        if (typeof this.props.onInvoke === "function" && !this.props.disabled) {
            switch (e.keyCode) {
                case KeyCodes.enter:
                case KeyCodes.space:
                    this.props.onInvoke(e, this.props);
                    break;
            }
        }

        if (typeof this.props.onKeyDown === "function") {
            this.props.onKeyDown(e);
        }
    };

    /**
     * Handle the keydown event of the item
     */
    private handleMenuItemClick = (e: React.MouseEvent<HTMLDivElement>): void => {
        if (typeof this.props.onInvoke === "function" && !this.props.disabled) {
            this.props.onInvoke(e, this.props);
        }

        if (typeof this.props.onClick === "function") {
            this.props.onClick(e);
        }
    };
}

export default ContextMenuItem;
export * from "./context-menu-item.props";
export { ContextMenuItemClassNameContract };
