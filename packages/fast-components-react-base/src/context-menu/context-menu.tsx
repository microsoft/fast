import * as React from "react";
import * as ReactDOM from "react-dom";
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
import {get, isFunction} from "lodash-es";
import {MenuItemRole} from "../utilities/aria";

export interface IContextMenuState {
    activeDescendent: string;
}


class ContextMenu extends Foundation<IContextMenuHandledProps & IContextMenuManagedClasses, IContextMenuUnhandledProps, IContextMenuState> {
    constructor(props: ContextMenuProps) {
        super(props);

        this.state = {
            activeDescendent: ""
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
    private renderChild = (child: React.ReactElement<ContextMenuItemProps>): React.ReactChild => {
        return React.cloneElement(child, {ref: this.setRef(child.props.id)} as any);
    }

    /**
     * get the ID props of all child menu items
     */
    private get childIds(): string[] {
        return React.Children.map(this.props.children, (child: React.ReactElement<ContextMenuItemProps>): string => child.props.id) || [];
    }

    private get activeDescendentNode(): HTMLElement {
        return ReactDOM.findDOMNode(this.getRef(this.state.activeDescendent));
    }

    /**
     * Handles the focus event on the root menu
     */
    private handleMenuFocus = (e: React.FocusEvent<HTMLUListElement>): void => {
        this.setState({
            activeDescendent: this.childIds[0] || ""
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
     * Manually fire click events on the activeDescendent - needed because document focus isn't
     * actually on that element
     */
    private clickActiveDescendent(): void {
        const activeNode = ReactDOM.findDOMNode(this.getRef(this.state.activeDescendent));

        if (isFunction(get(activeNode, "click"))) {
            activeNode.click();
        }
    }
    
    private close(): void {
        console.log("close");
        if (isFunction(this.props.onClose)) {
            this.props.onClose();
        }
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

            case KeyCodes.Enter:
                this.clickActiveDescendent();
                this.close();
                break;

            case KeyCodes.Space:
                this.clickActiveDescendent();

                if (this.activeDescendentNode && this.activeDescendentNode.getAttribute("role") === MenuItemRole.menuitem) {
                    this.close();
                }

                // When menuitemcheckbox, change state without closing menu
                // when menuitemradio, changes the state of all radios accordingly - don't close menu
                break;

            case KeyCodes.End:
                // Navigate to the last item
                this.setState({
                    activeDescendent: this.childIds[this.childIds.length] || ""
                });
                break;
              
            case KeyCodes.Home:  
                // Navigate to the first item
                this.setState({
                    activeDescendent: this.childIds[0] || ""
                });

                break;

                
            case KeyCodes.Escape:
                // Close the menu
                this.close();
                break;
        }
    }

}


export default ContextMenu;
export * from "./context-menu.props";
export {IContextMenuClassNameContract};
