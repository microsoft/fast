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
import { DisplayNamePrefix, extractHtmlElement } from "../utilities";
import {
    ToolbarHandledProps,
    ToolbarProps,
    ToolbarUnhandledProps,
} from "./toolbar.props";
import { Orientation } from "@microsoft/fast-web-utilities";
import ToolbarItemGroup from "../toolbar-item-group";
import { isArray } from "util";
import Tabbable from "tabbable";

export interface ToolbarState {
    /**
     * path to currently focused widget as string
     */
    focusItemPath: string | null;
}

class Toolbar extends Foundation<
    ToolbarHandledProps,
    ToolbarUnhandledProps,
    ToolbarState
> {
    public static displayName: string = `${DisplayNamePrefix}Toolbar`;
    public static toolbarItemAttributeName: string =
        "data-microsoft-fast-components-react-base-toolbar-item";
    public static toolbarItemGroupAttributeName: string =
        "data-microsoft-fast-components-react-base-toolbar-item-group";

    public static defaultProps: Partial<ToolbarProps> = {
        managedClasses: {},
        orientation: Orientation.horizontal,
    };

    protected handledProps: HandledProps<ToolbarHandledProps> = {
        children: void 0,
        managedClasses: void 0,
        initialFocusIndex: void 0,
        orientation: void 0,
    };

    private rootElement: React.RefObject<ToolbarItemGroup> = React.createRef<
        ToolbarItemGroup
    >();

    constructor(props: ToolbarProps) {
        super(props);

        this.state = {
            focusItemPath: isNil(this.props.initialFocusIndex)
                ? "-1"
                : (Array.isArray(this.props.initialFocusIndex)
                      ? this.props.initialFocusIndex
                      : [this.props.initialFocusIndex]
                  ).toString(),
        };
    }

    /**
     * Renders the component
     */
    public render(): React.ReactElement<HTMLDivElement> {
        return (
            <ToolbarItemGroup
                {...this.unhandledProps()}
                itemPath={[]}
                currentFocusPath={this.state.focusItemPath}
                onKeyDown={this.handleKeyDown}
                onFocusCapture={this.handleItemFocus}
                role="toolbar"
                ref={this.rootElement}
                // className={this.generateClassNames()}
            >
                {this.props.children}
            </ToolbarItemGroup>
        );
    }

    public componentDidMount(): void {
        const focusableWidgets: HTMLElement[] = this.getFocusableWidgets();

        if (focusableWidgets.length === 0) {
            return;
        }

        let initialFocusItemPath: number[] = [0];

        if (!isNil(this.props.initialFocusIndex)) {
            initialFocusItemPath = Array.isArray(this.props.initialFocusIndex)
                ? this.props.initialFocusIndex
                : [this.props.initialFocusIndex];
        }

        let itemPath: string = initialFocusItemPath.toString();

        if (this.getWidgetIndex(focusableWidgets, itemPath) === -1) {
            // default to first focusable widget
            itemPath = focusableWidgets[0].getAttribute(Toolbar.toolbarItemAttributeName);
        }

        this.setState({
            focusItemPath: itemPath,
        });
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
     * Handle the keydown event
     */
    private handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>): void => {
        if (this.props.orientation === Orientation.horizontal) {
            switch (e.keyCode) {
                case keyCodeArrowRight:
                    e.preventDefault();
                    this.setFocus(this.state.focusItemPath, 1);
                    break;

                case keyCodeArrowLeft:
                    e.preventDefault();
                    this.setFocus(this.state.focusItemPath, -1);
                    break;
            }
        } else {
            switch (e.keyCode) {
                case keyCodeArrowDown:
                    e.preventDefault();
                    this.setFocus(this.state.focusItemPath, 1);
                    break;

                case keyCodeArrowUp:
                    e.preventDefault();
                    this.setFocus(this.state.focusItemPath, -1);
                    break;
            }
        }
    };

    /**
     *
     */
    private handleItemFocus = (e: React.FocusEvent<HTMLElement>): void => {
        if (
            e.defaultPrevented ||
            !e.target.hasAttribute(Toolbar.toolbarItemAttributeName)
        ) {
            return;
        }

        e.preventDefault();

        this.setState({
            focusItemPath: e.target.getAttribute(Toolbar.toolbarItemAttributeName),
        });
    };

    /**
     *
     */
    private setFocus = (focusPath: string, adjustment: number): void => {
        let focusableWidgets: HTMLElement[] = this.getFocusableWidgets();

        if (focusableWidgets.length === 0) {
            return;
        }

        let targetItemIndex: number = -1;
        for (let i: number = 0; i < focusableWidgets.length; i++) {
            if (
                focusableWidgets[i].getAttribute(Toolbar.toolbarItemAttributeName) ===
                focusPath
            ) {
                targetItemIndex = i;
                break;
            }
        }

        if (targetItemIndex === -1) {
            focusableWidgets[0].focus();
            return;
        }

        targetItemIndex = targetItemIndex + adjustment;

        if (targetItemIndex > -1 && targetItemIndex < focusableWidgets.length) {
            focusableWidgets[targetItemIndex].focus();
        }
    };

    /**
     *
     */
    private getFocusableWidgets = (): HTMLElement[] => {
        const rootHtmlElement: HTMLElement = extractHtmlElement(this.rootElement);

        if (rootHtmlElement === null) {
            return [];
        }

        return this.appendContainerFocusableWidgets([], rootHtmlElement);
    };

    /**
     *
     */
    private appendContainerFocusableWidgets = (
        focusableWidgets: HTMLElement[],
        container: HTMLElement
    ): HTMLElement[] => {
        const children: Element[] = this.getDomChildren(container);

        for (let i: number = 0; i < children.length; i++) {
            if (children[i] instanceof HTMLElement) {
                const child: HTMLElement = children[i] as HTMLElement;

                if (child.hasAttribute(Toolbar.toolbarItemGroupAttributeName)) {
                    this.appendContainerFocusableWidgets(focusableWidgets, child);
                } else if (Tabbable.isFocusable(child as HTMLElement)) {
                    focusableWidgets.push(child);
                }
            }
        }

        return focusableWidgets;
    };

    /**
     *
     */
    private getWidgetIndex = (
        focusableWidgets: HTMLElement[],
        itemPath: string
    ): number => {
        let index: number = -1;

        for (let i: number = 0; i < focusableWidgets.length; i++) {
            if (focusableWidgets[i].getAttribute(Toolbar.toolbarItemGroupAttributeName)) {
                index = i;
                break;
            }
        }

        return index;
    };

    /**
     * Return an array of all children of the provided HTMLElement
     */
    private getDomChildren = (container: HTMLElement): Element[] => {
        return canUseDOM() && container instanceof HTMLElement
            ? Array.from(container.children)
            : [];
    };
}

export default Toolbar;
export * from "./toolbar.props";
export { ToolbarClassNameContract };
