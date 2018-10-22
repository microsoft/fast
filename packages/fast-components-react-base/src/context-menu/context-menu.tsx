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
import { clamp, get, inRange, isFunction } from "lodash-es";
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

    private rootElement: React.RefObject<HTMLDivElement> = React.createRef<
        HTMLDivElement
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
    public render(): React.ReactElement<HTMLDivElement> {
        return (
            <div
                {...this.unhandledProps()}
                ref={this.rootElement}
                role="menu"
                className={this.generateClassNames()}
                onKeyDown={this.handleMenuKeyDown}
            >
                {this.renderChildren()}
            </div>
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
    private domChildren(): Element[] {
        return canUseDOM() && this.rootElement.current instanceof HTMLElement
            ? Array.from(this.rootElement.current.children)
            : [];
    }

    /**
     * Sets focus to the nearest focusable element to the supplied focusIndex.
     * The adjustment controls how the function searches for other focusable elements
     * if the element at the focusIndex is not focusable. A positive number will search
     * towards the end of the children array, whereas a negative number will search towards
     * the beginning of the children array.
     */
    private setFocus(focusIndex: number, adjustment: number): void {
        const children: Element[] = this.domChildren();

        while (inRange(focusIndex, children.length)) {
            const child: Element = children[focusIndex];

            if (this.isFocusableElement(child)) {
                child.focus();

                this.setState({
                    focusIndex,
                });

                break;
            }

            focusIndex += adjustment;
        }
    }

    /**
     * Handle the keydown event of the root menu
     */
    private handleMenuKeyDown = (e: React.KeyboardEvent<HTMLDivElement>): void => {
        switch (e.keyCode) {
            case KeyCodes.ArrowDown:
            case KeyCodes.ArrowRight:
                e.preventDefault();
                this.setFocus(this.state.focusIndex + 1, 1);

                break;

            case KeyCodes.ArrowUp:
            case KeyCodes.ArrowLeft:
                e.preventDefault();
                this.setFocus(this.state.focusIndex - 1, -1);

                break;

            case KeyCodes.End:
                e.preventDefault();
                this.setFocus(this.domChildren().length - 1, -1);

                break;

            case KeyCodes.Home:
                e.preventDefault();
                this.setFocus(0, 1);

                break;
        }
    };
}

export default ContextMenu;
export * from "./context-menu.props";
export { ContextMenuClassNameContract };
