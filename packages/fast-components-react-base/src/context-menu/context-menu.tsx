import ReactDOM from "react-dom";
import { ContextMenuItemProps, ContextMenuItemRole } from "../context-menu-item";
import Foundation, { HandledProps } from "@microsoft/fast-components-foundation-react";
import { ContextMenuClassNameContract } from "@microsoft/fast-components-class-name-contracts-base";
import {
    ContextMenuHandledProps,
    ContextMenuProps,
    ContextMenuUnhandledProps,
} from "./context-menu.props";
import React from "react";
import { KeyCodes } from "@microsoft/fast-web-utilities";
import { get, inRange, invert } from "lodash-es";
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
    public static displayName: string = "ContextMenu";

    private static focusableElementRoles: { [key: string]: string } = invert(
        ContextMenuItemRole
    );

    protected handledProps: HandledProps<ContextMenuHandledProps> = {
        children: void 0,
        managedClasses: void 0,
        enableAutoFocus: void 0,
    };

    private rootElement: React.RefObject<HTMLDivElement> = React.createRef<
        HTMLDivElement
    >();

    constructor(props: ContextMenuProps) {
        super(props);

        this.state = {
            focusIndex: -1,
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

    public componentDidMount(): void {
        const children: Element[] = this.domChildren();
        const focusIndex: number = children.findIndex(this.isFocusableElement);

        if (focusIndex !== -1) {
            this.setState({
                focusIndex,
            });
        }

        if (this.props.enableAutoFocus) {
            this.focus();
        }
    }

    /**
     * Brings focus to the appropriate menu-item
     */
    public focus(): void {
        this.setFocus(this.state.focusIndex === -1 ? 0 : this.state.focusIndex, 1);
    }

    /**
     * Create class names
     */
    protected generateClassNames(): string {
        return super.generateClassNames(get(this.props.managedClasses, "contextMenu"));
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
            onFocus: this.handleMenuItemFocus,
        });
    };

    private isMenuItemElement(element: Element): element is HTMLElement {
        return (
            element instanceof HTMLElement &&
            ContextMenu.focusableElementRoles.hasOwnProperty(element.getAttribute("role"))
        );
    }

    /**
     * Determines if a given element should be focusable by the menu
     */
    private isFocusableElement = (element: Element): element is HTMLElement => {
        return this.isMenuItemElement(element) && !this.isDisabledElement(element);
    };

    private isDisabledElement = (element: Element): element is HTMLElement => {
        return (
            this.isMenuItemElement(element) &&
            element.getAttribute("aria-disabled") === "true"
        );
    };

    /**
     * Return an array of all focusabled elements that are children
     * of the context menu
     */
    private domChildren(): Element[] {
        return canUseDOM() && this.rootElement.current instanceof HTMLElement
            ? Array.from(this.rootElement.current.children)
            : [];
    }

    /**
     * Ensure we always validate our internal state on item focus events, otherwise
     * the component can get out of sync from click events
     */
    private handleMenuItemFocus = (e: React.FocusEvent<HTMLElement>): void => {
        const target: Element = e.currentTarget;
        const focusIndex: number = this.domChildren().indexOf(target);

        if (this.isDisabledElement(target)) {
            target.blur();

            return;
        }

        if (focusIndex !== this.state.focusIndex && focusIndex !== -1) {
            this.setFocus(focusIndex, focusIndex > this.state.focusIndex ? 1 : -1);
        }
    };

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
            case KeyCodes.arrowDown:
            case KeyCodes.arrowRight:
                e.preventDefault();
                this.setFocus(this.state.focusIndex + 1, 1);

                break;

            case KeyCodes.arrowUp:
            case KeyCodes.arrowLeft:
                e.preventDefault();
                this.setFocus(this.state.focusIndex - 1, -1);

                break;

            case KeyCodes.end:
                e.preventDefault();
                this.setFocus(this.domChildren().length - 1, -1);

                break;

            case KeyCodes.home:
                e.preventDefault();
                this.setFocus(0, 1);

                break;
        }
    };
}

export default ContextMenu;
export * from "./context-menu.props";
export { ContextMenuClassNameContract };
