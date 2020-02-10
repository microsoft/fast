import { ToolbarClassNameContract } from "@microsoft/fast-components-class-name-contracts-base";
import Foundation, { HandledProps } from "@microsoft/fast-components-foundation-react";
import {
    classNames,
    keyCodeArrowDown,
    keyCodeArrowLeft,
    keyCodeArrowRight,
    keyCodeArrowUp,
} from "@microsoft/fast-web-utilities";
import { canUseDOM } from "exenv-es6";
import { inRange, isNil } from "lodash-es";
import React from "react";
import { DisplayNamePrefix } from "../utilities";
import {
    ToolbarHandledProps,
    ToolbarProps,
    ToolbarUnhandledProps,
} from "./toolbar.props";
import { Orientation } from "@microsoft/fast-web-utilities";

export interface ToolbarState {
    /**
     * The index of the focusable child
     */
    focusIndex: number;
}

class Toolbar extends Foundation<
    ToolbarHandledProps,
    ToolbarUnhandledProps,
    ToolbarState
> {
    public static displayName: string = `${DisplayNamePrefix}Toolbar`;

    /**
     * The roles of direct children that the toolbar will assign focus to
     */
    public static DefaultFocusableRoles: string[] = [
        "button",
        "checkbox",
        "link",
        "menuitem",
        "menuitemradio",
        "menuitemcheckbox",
        "progressbar",
        "radio",
        "searchbox",
        "slider",
        "spinbutton",
        "switch",
        "textbox",
    ];

    public static defaultProps: Partial<ToolbarProps> = {
        managedClasses: {},
        orientation: Orientation.horizontal,
        allowFocusOnDisabledItems: true,
        focusableRoles: Toolbar.DefaultFocusableRoles,
    };

    protected handledProps: HandledProps<ToolbarHandledProps> = {
        children: void 0,
        managedClasses: void 0,
        enableAutoFocus: void 0,
        initialFocusIndex: void 0,
        orientation: void 0,
        focusableRoles: void 0,
        allowFocusOnDisabledItems: void 0,
    };

    private rootElement: React.RefObject<HTMLDivElement> = React.createRef<
        HTMLDivElement
    >();

    constructor(props: ToolbarProps) {
        super(props);

        this.state = {
            focusIndex: isNil(this.props.initialFocusIndex)
                ? -1
                : this.props.initialFocusIndex,
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
                role="toolbar"
                className={this.generateClassNames()}
                onKeyDown={this.handleMenuKeyDown}
                onFocusCapture={this.handleItemFocus}
            >
                {this.renderChildren()}
            </div>
        );
    }

    public componentDidMount(): void {
        if (this.state.focusIndex === -1) {
            const children: Element[] = this.domChildren();
            this.setState({
                focusIndex: children.findIndex(this.isFocusableElement),
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
        const {
            toolbar,
            toolbar__horizontal,
            toolbar__vertical,
        }: ToolbarClassNameContract = this.props.managedClasses;
        const isVertical: boolean = this.props.orientation === Orientation.vertical;

        return super.generateClassNames(
            classNames(
                this.props.managedClasses.toolbar,
                [toolbar__vertical, isVertical],
                [toolbar__horizontal, !isVertical]
            )
        );
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
        child: React.ReactElement,
        index: number
    ): React.ReactChild => {
        return React.cloneElement(child, {
            tabIndex: index === this.state.focusIndex ? 0 : -1,
        });
    };

    /**
     * Determines if a given element should be focusable by the menu
     */
    private isFocusableElement = (element: Element): element is HTMLElement => {
        return (
            element instanceof HTMLElement &&
            this.props.focusableRoles.indexOf(element.getAttribute("role")) !== -1 &&
            (this.props.allowFocusOnDisabledItems || !this.isDisabledElement(element))
        );
    };

    private isDisabledElement = (element: Element): element is HTMLElement => {
        return (
            element instanceof HTMLElement &&
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
    private handleItemFocus = (e: React.FocusEvent<HTMLElement>): void => {
        const target: Element = e.currentTarget;
        const focusIndex: number = this.domChildren().indexOf(target);

        if (focusIndex === -1) {
            return;
        }

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
        if (this.props.orientation === Orientation.horizontal) {
            switch (e.keyCode) {
                case keyCodeArrowRight:
                    e.preventDefault();
                    this.setFocus(this.state.focusIndex + 1, 1);
                    break;

                case keyCodeArrowLeft:
                    e.preventDefault();
                    this.setFocus(this.state.focusIndex - 1, -1);
                    break;
            }
        } else {
            switch (e.keyCode) {
                case keyCodeArrowDown:
                    e.preventDefault();
                    this.setFocus(this.state.focusIndex + 1, 1);
                    break;

                case keyCodeArrowUp:
                    e.preventDefault();
                    this.setFocus(this.state.focusIndex - 1, -1);
                    break;
            }
        }
    };
}

export default Toolbar;
export * from "./toolbar.props";
export { ToolbarClassNameContract };
