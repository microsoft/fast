import { ToolbarClassNameContract } from "@microsoft/fast-components-class-name-contracts-base";
import Foundation, { HandledProps } from "@microsoft/fast-components-foundation-react";
import {
    keyCodeArrowDown,
    keyCodeArrowLeft,
    keyCodeArrowRight,
    keyCodeArrowUp,
    keyCodeEnd,
    keyCodeHome,
} from "@microsoft/fast-web-utilities";
import { canUseDOM } from "exenv-es6";
import { isNil } from "lodash-es";
import React from "react";
import { DisplayNamePrefix, extractHtmlElement } from "../utilities";
import {
    ToolbarHandledProps,
    ToolbarProps,
    ToolbarUnhandledProps,
} from "./toolbar.props";
import { Orientation } from "@microsoft/fast-web-utilities";
import ToolbarItemGroup from "../toolbar-item-group";
import { ToolbarContext } from "./toolbar-context";
import Tabbable from "tabbable";

export interface ToolbarState {
    /**
     * path to currently focused widget as string
     */
    focusItemPath: string;
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

    public static isFocusable = (element: HTMLElement): boolean => {
        return Tabbable.isFocusable(element);
    };

    protected handledProps: HandledProps<ToolbarHandledProps> = {
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
        const {
            toolbar,
            toolbar__horizontal,
            toolbar__vertical,
        }: ToolbarClassNameContract = this.props.managedClasses;

        return (
            <ToolbarContext.Provider
                value={{
                    currentFocusItemPath: this.state.focusItemPath,
                    orientation: this.props.orientation,
                }}
            >
                <ToolbarItemGroup
                    {...this.unhandledProps()}
                    itemPath={[]}
                    onKeyDown={this.handleKeyDown}
                    onFocusCapture={this.updateFocusItemPath}
                    onBlurCapture={this.updateFocusItemPath}
                    role="toolbar"
                    ref={this.rootElement}
                    managedClasses={{
                        toolbarItemGroup: toolbar,
                        toolbarItemGroup__horizontal: toolbar__horizontal,
                        toolbarItemGroup__vertical: toolbar__vertical,
                    }}
                >
                    {this.props.children}
                </ToolbarItemGroup>
            </ToolbarContext.Provider>
        );
    }

    public componentDidMount(): void {
        // When the toolbar first mounts we need to identify where to put focus if the toolbar gets it
        const focusableItems: HTMLElement[] = this.getFocusableItems();

        if (focusableItems.length === 0) {
            return;
        }

        this.setDefaultFocusItem(focusableItems);
    }

    public componentDidUpdate(prevProps: ToolbarProps): void {
        // if props have changed and we don't contain focus we need to ensure the
        // default focus item is valid
        // we don't do this when focus is within the toolbar because focus/blur
        // event handling deals with it
        if (
            prevProps !== this.props &&
            this.rootElement.current instanceof HTMLElement &&
            !(this.rootElement.current as HTMLElement).contains(document.activeElement)
        ) {
            // reset if initialFocusIndex prop has changed
            if (prevProps.initialFocusIndex !== this.props.initialFocusIndex) {
                this.setDefaultFocusItem(this.getFocusableItems());
                return;
            }

            this.validateCurrentFocusItem();
        }
    }

    /**
     * Ensures that the current focus item path is valid
     * and resets if not
     */
    private validateCurrentFocusItem = (): void => {
        const focusableItems: HTMLElement[] = this.getFocusableItems();

        if (focusableItems.length === 0) {
            this.setState({
                focusItemPath: "-1",
            });
            return;
        }

        if (
            // reset default focus if the old focused item does not exist
            this.getItemIndex(focusableItems, this.state.focusItemPath) === -1
        ) {
            this.setDefaultFocusItem(focusableItems);
        }
    };

    /**
     * Sets the current focuus item path based on default focus item
     */
    private setDefaultFocusItem = (focusableItems: HTMLElement[]): void => {
        let initialFocusItemPath: number[] = [0];

        if (!isNil(this.props.initialFocusIndex)) {
            initialFocusItemPath = Array.isArray(this.props.initialFocusIndex)
                ? this.props.initialFocusIndex
                : [this.props.initialFocusIndex];
        }

        let itemPath: string = initialFocusItemPath.toString();

        if (this.getItemIndex(focusableItems, itemPath) === -1) {
            // default to first focusable widget
            itemPath = focusableItems[0].getAttribute(Toolbar.toolbarItemAttributeName);
        }

        this.setState({
            focusItemPath: itemPath,
        });
    };

    /**
     * Handle the keydown event
     */
    private handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>): void => {
        // increment focused widget on arrow keys
        if (this.props.orientation === Orientation.horizontal) {
            switch (e.keyCode) {
                case keyCodeArrowRight:
                    e.preventDefault();
                    this.incrementFocus(this.state.focusItemPath, 1);
                    break;

                case keyCodeArrowLeft:
                    e.preventDefault();
                    this.incrementFocus(this.state.focusItemPath, -1);
                    break;
            }
        } else {
            switch (e.keyCode) {
                case keyCodeArrowDown:
                    e.preventDefault();
                    this.incrementFocus(this.state.focusItemPath, 1);
                    break;

                case keyCodeArrowUp:
                    e.preventDefault();
                    this.incrementFocus(this.state.focusItemPath, -1);
                    break;
            }
        }

        // shortcuts
        let focusableWidgets: HTMLElement[] = null;
        switch (e.keyCode) {
            case keyCodeHome:
                e.preventDefault();
                focusableWidgets = this.getFocusableItems();
                if (focusableWidgets.length === 0) {
                    return;
                }
                focusableWidgets[0].focus();
                break;

            case keyCodeEnd:
                e.preventDefault();
                focusableWidgets = this.getFocusableItems();
                if (focusableWidgets.length === 0) {
                    return;
                }
                focusableWidgets[focusableWidgets.length - 1].focus();
                break;
        }
    };

    /**
     * Respond to focus changes within the component (on blur/focus capture)
     * Essentially we want to validate that the default focus item is valid
     */
    private updateFocusItemPath = (e: React.FocusEvent<HTMLElement>): void => {
        if (e.target.hasAttribute(Toolbar.toolbarItemAttributeName)) {
            this.setState({
                focusItemPath: e.target.getAttribute(Toolbar.toolbarItemAttributeName),
            });
            return;
        }

        this.validateCurrentFocusItem();
    };

    /**
     *  Increments focus relative to the item with the provided path
     */
    private incrementFocus = (focusPath: string, adjustment: number): void => {
        const focusableItems: HTMLElement[] = this.getFocusableItems();

        if (focusableItems.length === 0) {
            return;
        }

        let targetItemIndex: number = -1;
        for (let i: number = 0; i < focusableItems.length; i++) {
            if (
                focusableItems[i].getAttribute(Toolbar.toolbarItemAttributeName) ===
                focusPath
            ) {
                targetItemIndex = i;
                break;
            }
        }

        if (targetItemIndex === -1) {
            focusableItems[0].focus();
            return;
        }

        targetItemIndex = targetItemIndex + adjustment;

        if (targetItemIndex > -1 && targetItemIndex < focusableItems.length) {
            focusableItems[targetItemIndex].focus();
        }
    };

    /**
     *  Returns an array of focusable items in the toolbar in focus order
     */
    private getFocusableItems = (): HTMLElement[] => {
        const rootHtmlElement: HTMLElement = extractHtmlElement(this.rootElement);

        if (rootHtmlElement === null) {
            return [];
        }

        return this.appendContainerFocusableItems([], rootHtmlElement);
    };

    /**
     *  Recursive function that retrieves focusable items from provided toolbar item group
     */
    private appendContainerFocusableItems = (
        focusableItems: HTMLElement[],
        container: HTMLElement
    ): HTMLElement[] => {
        const children: Element[] = this.getDomChildren(container);

        children.forEach((child: HTMLElement, index: number) => {
            if (child.hasAttribute(Toolbar.toolbarItemGroupAttributeName)) {
                this.appendContainerFocusableItems(focusableItems, child);
            } else if (Toolbar.isFocusable(child as HTMLElement)) {
                focusableItems.push(child);
            }
        });

        return focusableItems;
    };

    /**
     *  Get the index of an item with the provided itemPath from the provided array of items
     */
    private getItemIndex = (focusableItems: HTMLElement[], itemPath: string): number => {
        let index: number = -1;

        for (let i: number = 0; i < focusableItems.length; i++) {
            if (
                focusableItems[i].getAttribute(Toolbar.toolbarItemAttributeName) ===
                itemPath
            ) {
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
