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
import { canUseDOM } from "exenv-es6";

export interface ContextMenuState {
    /**
     * The index of the focusable child
     */
    focusIndex: number;
}

class ContextMenu extends Foundation<
    ContextMenuHandledProps,
    ContextMenuUnhandledProps,
    ContextMenuState
> {
    protected handledProps: HandledProps<ContextMenuHandledProps> = {
        children: void 0,
        managedClasses: void 0,
    };

    private rootElement: React.RefObject<HTMLUListElement> = React.createRef<
        HTMLUListElement
    >();

    constructor(props: ContextMenuProps) {
        super(props);

        this.state = {
            focusIndex: 0,
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
    private renderChild = (
        child: React.ReactElement<ContextMenuItemProps>,
        index: number
    ): React.ReactChild => {
        return React.cloneElement(child, {
            tabIndex: index === this.state.focusIndex ? 0 : -1,
        });
    };

    /**
     * Determines if a given element should be focusable by the menu
     */
    private isFocusableElement(element: Element): element is HTMLElement {
        return (
            element instanceof HTMLElement &&
            ContextMenuItemRole.hasOwnProperty(element.getAttribute("role"))
        );
    }

    /**
     * Return an array of all focusabled elements that are children
     * of the context-menu
     */
    private focusableChildren(): HTMLElement[] {
        if (!canUseDOM()) {
            return [];
        }

        const root: HTMLUListElement | null = this.rootElement.current;

        return root instanceof HTMLElement
            ? Array.from(this.rootElement.current.children).filter(
                  this.isFocusableElement
              )
            : [];
    }

    /**
     * Applies focus to an index of focusable children
     */
    private setFocus(index: number): void {
        if (canUseDOM()) {
            const element: Element = this.focusableChildren()[index];

            if (this.isFocusableElement(element)) {
                element.focus();

                this.setState({
                    focusIndex: index,
                });
            }
        }
    }

    /**
     * Handle the keydown event of the root menu
     */
    private handleMenuKeyDown = (e: React.KeyboardEvent<HTMLUListElement>): void => {
        switch (e.keyCode) {
            case KeyCodes.ArrowDown:
            case KeyCodes.ArrowRight:
                e.preventDefault();
                this.setFocus(this.state.focusIndex + 1);

                break;

            case KeyCodes.ArrowUp:
            case KeyCodes.ArrowLeft:
                e.preventDefault();
                this.setFocus(this.state.focusIndex - 1);

                break;

            case KeyCodes.End:
                e.preventDefault();
                this.setFocus(this.focusableChildren().length - 1);

                break;

            case KeyCodes.Home:
                e.preventDefault();
                this.setFocus(0);

                break;
        }
    };
}

export default ContextMenu;
export * from "./context-menu.props";
export { ContextMenuClassNameContract };
