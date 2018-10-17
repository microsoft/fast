import * as ReactDOM from "react-dom";
import { ContextMenuItemProps, ContextMenuItemRole } from "../context-menu-item";
import Foundation, { HandledProps } from "@microsoft/fast-components-foundation-react";
import { ContextMenuClassNameContract } from "@microsoft/fast-components-class-name-contracts-base";
import {
    ContextMenuHandledProps,
    ContextMenuManagedClasses,
    ContextMenuProps,
    ContextMenuUnhandledProps,
} from "./context-menu.props";
import * as React from "react";
import KeyCodes from "../utilities/keycodes";
import { clamp, get, isFunction } from "lodash-es";
import { MenuItemRole } from "../utilities/aria";

export interface ContextMenuState {
    /**
     * The index of the focusable child
     */
    focusIndex: number;
}

class ContextMenu extends Foundation<ContextMenuHandledProps, ContextMenuUnhandledProps, ContextMenuState> {
    protected handledProps: HandledProps<ContextMenuHandledProps> = {
        children: void 0,
        managedClasses: void 0,
    };

    private rootElement: React.RefObject<HTMLUListElement> = React.createRef<HTMLUListElement>();

    constructor(props: ContextMenuProps) {
        super(props);

        this.state = {
            focusIndex: 0
        };
    }

    /**
     * Renders the component
     */
    public render(): React.ReactElement<HTMLUListElement> {
        return (
            <ul
                {...this.unhandledProps()}
                ref={this.rootElement}
                role="menu"
                className={this.generateClassNames()}
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
    private renderChild = (child: React.ReactElement<ContextMenuItemProps>, index: number): React.ReactChild => {
        return React.cloneElement(
            child,
            {
                tabIndex: index === this.state.focusIndex ? 0 : -1,
            }
        );
    }

    /**
     * Determines if a given element should be focusable by the menu
     */
    private isFocusableElement(element: Element): boolean {
        return (
            element instanceof HTMLElement
            && ContextMenuItemRole.hasOwnProperty(element.getAttribute("role"))
        );
    }

    private shiftFocus(delta: number): void {

    }

    /**
     * Handle the keydown event of the root menu
     */
    private handleMenuKeyDown = (e: React.KeyboardEvent<HTMLUListElement>): void => {
        const focused: Element = document.activeElement;

        if (!Boolean(focused instanceof HTMLElement)) {
            return;
        }

        switch (e.keyCode) {
            case KeyCodes.ArrowDown:
            case KeyCodes.ArrowRight:
                this.shiftFocus(1);
                // if (focused.nextElementSibling instanceof HTMLElement) {
                //     focused.nextElementSibling.focus();

                //     this.setState({
                //         focusIndex: this.state.focusIndex + 1
                //     });
                // }

                break;

            case KeyCodes.ArrowUp:
            case KeyCodes.ArrowLeft:
                this.shiftFocus(-1);
                // if (focused.previousElementSibling instanceof HTMLElement) {
                //     focused.previousElementSibling.focus();

                //     this.setState({
                //         focusIndex: this.state.focusIndex - 1
                //     });
                // }

                // break;

            case KeyCodes.End:
                if (
                    this.rootElement.current instanceof HTMLElement
                    && this.rootElement.current.lastElementChild instanceof HTMLElement
                ) {
                    this.rootElement.current.lastElementChild.focus();

                    this.setState({
                        focusIndex: React.Children.count(this.props.children) - 1
                    });
                }

                break;

            case KeyCodes.Home:
                if (
                    this.rootElement.current instanceof HTMLElement
                    && this.rootElement.current.firstElementChild instanceof HTMLElement
                ) {
                    this.rootElement.current.firstElementChild.focus();
                    this.setState({
                        focusIndex: 0
                    });
                }

                break;
        }
    }

}

export default ContextMenu;
export * from "./context-menu.props";
