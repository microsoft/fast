import { ContextMenuItemClassNameContract } from "@microsoft/fast-components-class-name-contracts-base";
import Foundation, { HandledProps } from "@microsoft/fast-components-foundation-react";
import { classNames, keyCodeEnter, keyCodeSpace } from "@microsoft/fast-web-utilities";
import React from "react";
import { DisplayNamePrefix } from "../utilities";
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
    public static displayName: string = `${DisplayNamePrefix}ContextMenuItem`;

    public static defaultProps: Partial<ContextMenuItemProps> = {
        role: ContextMenuItemRole.menuItem,
        disabled: false,
        managedClasses: {},
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
                onContextMenu={this.handleContextMenu}
            >
                {this.props.children}
            </div>
        );
    }

    /**
     * Create class-names
     */
    protected generateClassNames(): string {
        const {
            contextMenuItem,
            contextMenuItem__checkbox,
            contextMenuItem__radio,
            contextMenuItem__disabled,
        }: ContextMenuItemClassNameContract = this.props.managedClasses;
        const role: ContextMenuItemRole = this.props.role;

        return super.generateClassNames(
            classNames(
                contextMenuItem,
                [
                    contextMenuItem__checkbox,
                    role === ContextMenuItemRole.menuItemCheckbox,
                ],
                [contextMenuItem__radio, role === ContextMenuItemRole.menuItemRadio],
                [contextMenuItem__disabled, this.props.disabled]
            )
        );
    }

    /**
     * Handle the keydown event of the item
     */
    private handleMenuItemKeyDown = (e: React.KeyboardEvent<HTMLDivElement>): void => {
        switch (e.keyCode) {
            case keyCodeEnter:
            case keyCodeSpace:
                this.handleInvoke(e);
                break;
        }

        if (typeof this.props.onKeyDown === "function") {
            this.props.onKeyDown(e);
        }
    };

    /**
     * Handle the keydown event of the item
     */
    private handleMenuItemClick = (e: React.MouseEvent<HTMLDivElement>): void => {
        this.handleInvoke(e);

        if (typeof this.props.onClick === "function") {
            this.props.onClick(e);
        }
    };

    /**
     * Handle the contextMenu event
     */
    private handleContextMenu = (e: React.MouseEvent<HTMLDivElement>): void => {
        e.preventDefault(); // Cancel browser context-menu because the user is clicking the context-menu-item

        this.handleInvoke(e);

        if (typeof this.props.onContextMenu === "function") {
            this.props.onContextMenu(e);
        }
    };

    /**
     * Inform app-authors that the user has invoked the item
     */
    private handleInvoke(
        e: React.MouseEvent<HTMLDivElement> | React.KeyboardEvent<HTMLDivElement>
    ): void {
        if (typeof this.props.onInvoke === "function" && !this.props.disabled) {
            this.props.onInvoke(e, this.props);
        }
    }
}

export default ContextMenuItem;
export * from "./context-menu-item.props";
export { ContextMenuItemClassNameContract };
