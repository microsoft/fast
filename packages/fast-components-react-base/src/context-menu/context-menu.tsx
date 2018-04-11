import * as React from "react";
import Foundation, { HandledProps } from "../foundation";
import { IContextMenuClassNameContract } from "@microsoft/fast-components-class-name-contracts";
import {
    ContextMenuProps,
    IContextMenuHandledProps,
    IContextMenuManagedClasses,
    IContextMenuUnhandledProps,
} from "./context-menu.props";
import {ContextMenuItemProps} from "../context-menu-item";
import KeyCodes from "../utilities/keycodes";

export interface IContextMenuState {
    activeDescendent: string;
}


class ContextMenu extends Foundation<IContextMenuHandledProps & IContextMenuManagedClasses, IContextMenuUnhandledProps, IContextMenuState> {
    constructor(props: ContextMenuProps) {
        super(props);

        this.state = {
            activeDescendent: null
        };
    }

    public static defaultProps: IContextMenuHandledProps = {
        open: false
    };

    protected handledProps: HandledProps<IContextMenuHandledProps & IContextMenuManagedClasses> = {
        children: void 0,
        managedClasses: void 0,
        open: void 0
    };

    /**
     * Renders the component
     */
    public render(): React.ReactElement<HTMLUListElement> {
        return (
            <ul
                aria-activedescendant={this.state.activeDescendent}
                aria-hidden={!this.props.open}
                className={this.generateClassNames()}
                tabIndex={this.props.open ? 0 : -1}
                onFocus={this.handleMenuFocus}
                onBlur={this.handleMenuBlur}
                onKeyDown={this.handleMenuKeyDown}
            >
                {this.renderChildren()}
            </ul>
        );
    }

    /**
     * Create class-names
     */
    protected generateClassNames(): string {
        return super.generateClassNames(this.props.managedClasses.contextMenu);
    }

    /**
     * Render all child elements
     */
    private renderChildren(): React.ReactChild[] {
        return React.Children.map(this.props.children, this.renderChild);
    }

    /**
     * Render a single child
     */
    private renderChild(child: React.ReactElement<ContextMenuItemProps>): React.ReactChild {
        return child;
    }

    /**
     * get the ID props of all child menu items
     */
    private getChildIds(): string[] {
        return React.Children.count(this.props.children) > 0
            ? React.Children.map(this.props.children, (child: React.ReactElement<ContextMenuItemProps>): string => child.props.id)
            : []
    }

    /**
     * Handles the focus event on the root menu
     */
    private handleMenuFocus = (e: React.FocusEvent<HTMLUListElement>): void => {
        this.setState({
            activeDescendent: this.getChildIds()[0] || null
        });
    }

    /**
     * Handle blurring the root menu
     */
    private handleMenuBlur = (e: React.FocusEvent<HTMLUListElement>): void => {
        // TODO: we'll only want to change this & close of the focus is still inside the root element
        this.setState({
            activeDescendent: null
        });
    }

    /**
     * Handle the keydown event of the root menu
     */
    private handleMenuKeyDown = (e: React.KeyboardEvent<HTMLUListElement>): void => {
        switch (e.keyCode) {
            case KeyCodes.ArrowDown:
            case KeyCodes.ArrowRight:
                // Navigate down and wrap
                break;
            case KeyCodes.ArrowUp:
            case KeyCodes.ArrowLeft:
                // Navigate up and wrap
                break;

            case KeyCodes.Space:
                // When menuitemcheckbox, change state without closing menu
                // when menuitemradio, changes the state of all radios accordingly
                // when menuitem, active the menu item and close the menu
                break;

            case KeyCodes.Enter:
                // Active item and close the menu
                break;

            case KeyCodes.End:
                // Navigate to the last item
                break;
              
            case KeyCodes.Home:  
                // Navigate to the first item
                break;

            case KeyCodes.Escape:
                // Close the menu
                break;
        }
    }

}


export default ContextMenu;
export * from "./context-menu.props";
export {IContextMenuClassNameContract};
