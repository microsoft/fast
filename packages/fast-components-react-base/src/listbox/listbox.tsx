import * as ReactDOM from "react-dom";
import Foundation, { HandledProps } from "@microsoft/fast-components-foundation-react";
import { ListboxClassNameContract } from "@microsoft/fast-components-class-name-contracts-base";
import {
    ListboxHandledProps,
    ListboxProps,
    ListboxUnhandledProps,
} from "./listbox.props";
import * as React from "react";
import { KeyCodes } from "@microsoft/fast-web-utilities";
import { get, inRange, isEqual } from "lodash-es";
import { canUseDOM } from "exenv-es6";
import { ListboxContext, ListboxItemData } from "./listbox-context";

export interface ListboxState {
    /**
     * The index of the focusable child
     */
    focusIndex: number;
    focussedItemId: string;
    selectedItems: ListboxItemData[];
}

class Listbox extends Foundation<
    ListboxHandledProps,
    ListboxUnhandledProps,
    ListboxState
> {
    public static displayName: string = "Listbox";
    public static valuePropertyKey: string = "value";
    public static idPropertyKey: string = "id";
    public static displayStringPropertyKey: string = "displayString";

    public static defaultProps: Partial<ListboxProps> = {
        multiselectable: false,
        defaultSelection: [],
    };

    protected handledProps: HandledProps<ListboxHandledProps> = {
        children: void 0,
        defaultSelection: void 0,
        labelledBy: void 0,
        managedClasses: void 0,
        multiselectable: void 0,
        onSelectionChange: void 0,
        selectedItems: void 0,
        typeAheadPropertyKey: void 0,
    };

    private rootElement: React.RefObject<HTMLDivElement> = React.createRef<
        HTMLDivElement
    >();

    private typeAheadString: string = "";
    private typeAheadTimer: NodeJS.Timer;
    private shiftRangeSelectStartIndex: number = -1;

    constructor(props: ListboxProps) {
        super(props);

        this.state = {
            focusIndex: -1,
            focussedItemId: "",
            selectedItems:
                this.props.selectedItems === undefined
                    ? this.props.defaultSelection
                    : this.props.selectedItems,
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
                role="listbox"
                aria-multiselectable={this.props.multiselectable || null}
                aria-activedescendant={this.state.focussedItemId}
                aria-labelledby={this.props.labelledBy || null}
                className={this.generateClassNames()}
                onKeyDown={this.handleMenuKeyDown}
            >
                <ListboxContext.Provider
                    value={{
                        selectedItems: this.state.selectedItems,
                        itemFocused: this.listboxItemfocused,
                        itemInvoked: this.listboxItemInvoked,
                        multiselectable: this.props.multiselectable,
                    }}
                >
                    {this.renderChildren()}
                </ListboxContext.Provider>
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
    }

    public componentWillUnmount(): void {
        clearTimeout(this.typeAheadTimer);
    }

    /**
     * Create class names
     */
    protected generateClassNames(): string {
        return super.generateClassNames(get(this.props.managedClasses, "listbox", ""));
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
        child: React.ReactElement<any>,
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
            element instanceof HTMLElement && element.getAttribute("role") === "option"
        );
    };

    /**
     * Determines if a given element is disabled
     */
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
     * Sets focus to the nearest focusable element to the supplied focusIndex.
     * The adjustment controls how the function searches for other focusable elements
     * if the element at the focusIndex is not focusable. A positive number will search
     * towards the end of the children array, whereas a negative number will search towards
     * the beginning of the children array.  Returns the focussed item id or an empty string
     * if none found
     */
    private setFocus(focusIndex: number, adjustment: number): string {
        const children: Element[] = this.domChildren();
        let focusItemId: string = "";

        while (inRange(focusIndex, children.length)) {
            const child: Element = children[focusIndex];
            focusItemId = child.id;
            if (this.isFocusableElement(child)) {
                child.focus();

                this.setState({
                    focusIndex,
                    focussedItemId: child.id === undefined ? "" : focusItemId,
                });

                break;
            }

            focusIndex += adjustment;
        }

        return focusItemId;
    }

    /**
     * Handle the keydown event of the root menu
     */
    private handleMenuKeyDown = (event: React.KeyboardEvent<HTMLDivElement>): void => {
        if (event.defaultPrevented) {
            return;
        }

        let focusItemId: string;

        switch (event.keyCode) {
            case KeyCodes.arrowDown:
            case KeyCodes.arrowRight:
                event.preventDefault();
                focusItemId = this.setFocus(this.state.focusIndex + 1, 1);

                if (this.props.multiselectable && event.shiftKey && focusItemId !== "") {
                    const itemData: ListboxItemData = this.getItemDataById(focusItemId);
                    if (itemData !== null) {
                        this.toggleItem(itemData, event);
                    }
                }

                break;

            case KeyCodes.arrowUp:
            case KeyCodes.arrowLeft:
                event.preventDefault();
                focusItemId = this.setFocus(this.state.focusIndex - 1, -1);
                if (this.props.multiselectable && event.shiftKey && focusItemId !== "") {
                    const itemData: ListboxItemData = this.getItemDataById(focusItemId);
                    if (itemData !== null) {
                        this.toggleItem(itemData, event);
                    }
                }
                break;

            case KeyCodes.end:
                event.preventDefault();
                if (this.props.multiselectable && event.shiftKey && event.ctrlKey) {
                    this.selectRange(
                        this.state.focusIndex,
                        this.domChildren().length - 1
                    );
                }
                this.setFocus(this.domChildren().length - 1, -1);

                break;

            case KeyCodes.home:
                event.preventDefault();
                if (this.props.multiselectable && event.shiftKey && event.ctrlKey) {
                    this.selectRange(0, this.state.focusIndex);
                }
                this.setFocus(0, 1);

                break;

            default:
                if (event.key === "A") {
                    event.preventDefault();
                    this.selectRange(0, this.domChildren().length);
                } else if (!event.ctrlKey) {
                    this.processTypeAhead(event);
                }
        }
    };

    private getItemDataById = (itemId: string): ListboxItemData => {
        const children: React.ReactNode[] = React.Children.toArray(this.props.children);

        const focusChild: React.ReactNode = children.find(
            (child: React.ReactElement<any>): boolean => {
                if (
                    child.props[Listbox.idPropertyKey] === undefined ||
                    child.props[Listbox.idPropertyKey] !== itemId
                ) {
                    return false;
                }
                return true;
            }
        );

        if (focusChild) {
            const itemData: ListboxItemData = {
                id: itemId,
                displayString: (focusChild as React.ReactElement<any>).props[
                    Listbox.displayStringPropertyKey
                ],
                value: (focusChild as React.ReactElement<any>).props[
                    Listbox.valuePropertyKey
                ],
            };
            return itemData;
        }

        return null;
    };

    /**
     * Sets focus based on characters typed
     */
    private processTypeAhead = (e: React.KeyboardEvent<HTMLDivElement>): void => {
        e.preventDefault();

        clearTimeout(this.typeAheadTimer);

        this.typeAheadString = this.typeAheadString + e.key.toLowerCase();

        let matchIndex: number = -1;

        const children: React.ReactNode[] = React.Children.toArray(this.props.children);

        children.some(
            (child: React.ReactElement<any>, index: number): boolean => {
                if (child.props[this.props.typeAheadPropertyKey] === undefined) {
                    return false;
                }
                if (
                    child.props[this.props.typeAheadPropertyKey]
                        .toLowerCase()
                        .startsWith(this.typeAheadString)
                ) {
                    matchIndex = index;
                    return true;
                }
            }
        );

        if (matchIndex !== -1) {
            this.typeAheadTimer = setTimeout((): void => {
                this.typeAheadTimerExpired();
            }, 1000);
            this.setFocus(matchIndex, 1);
        } else {
            this.typeAheadString = "";
        }
    };

    /**
     * clears the type ahead buffer after specified time of no typing
     */
    private typeAheadTimerExpired = (): void => {
        this.typeAheadString = "";
        clearTimeout(this.typeAheadTimer);
    };

    /**
     * Function called by child items when they have been invoked
     */
    private listboxItemInvoked = (
        item: ListboxItemData,
        event: React.MouseEvent<HTMLDivElement> | React.KeyboardEvent<HTMLDivElement>
    ): void => {
        const target: Element = event.currentTarget;
        const itemIndex: number = this.domChildren().indexOf(target);
        if (this.props.multiselectable && event.type === "click") {
            if (!event.shiftKey || this.shiftRangeSelectStartIndex === -1) {
                this.shiftRangeSelectStartIndex = itemIndex;
            }
            if (event.ctrlKey) {
                this.toggleItem(item, event);
            } else if (event.shiftKey) {
                this.selectRange(this.shiftRangeSelectStartIndex, itemIndex);
            } else {
                this.updateSelection([item]);
            }
        } else if (this.props.multiselectable && event.type === "keydown") {
            if (event.shiftKey) {
                this.selectRange(this.shiftRangeSelectStartIndex, itemIndex);
            } else {
                this.toggleItem(item, event);
            }
        } else {
            this.updateSelection([item]);
        }
    };

    /**
     * Toggle the selection state of the item
     */
    private toggleItem = (
        item: ListboxItemData,
        event: React.MouseEvent<HTMLDivElement> | React.KeyboardEvent<HTMLDivElement>
    ): void => {
        const culledSelection: ListboxItemData[] = this.state.selectedItems.filter(
            (listboxItem: ListboxItemData) => {
                return listboxItem.id !== item.id;
            }
        );
        if (culledSelection.length < this.state.selectedItems.length) {
            this.updateSelection(culledSelection);
        } else {
            const newSelectedItems: ListboxItemData[] = [item].concat(
                this.state.selectedItems
            );
            this.updateSelection(newSelectedItems);
        }
    };

    /**
     * Select a range of items
     */
    private selectRange = (startIndex: number, endIndex: number): void => {
        const children: React.ReactNode[] = React.Children.toArray(this.props.children);
        const childrenInRange: React.ReactNode[] = children.slice(
            startIndex >= endIndex ? endIndex : startIndex,
            startIndex >= endIndex ? startIndex + 1 : endIndex + 1
        );

        const selectableChildren: React.ReactNode[] = childrenInRange.filter(
            (child: React.ReactElement<any>) => {
                if (
                    child.props[Listbox.valuePropertyKey] === undefined ||
                    child.props[Listbox.displayStringPropertyKey] === undefined
                ) {
                    return false;
                }
                return true;
            }
        );

        const newSelectedItems: ListboxItemData[] = selectableChildren.map(
            (child: React.ReactElement<any>) => {
                const thisItemData: ListboxItemData = {
                    id: child.props.id,
                    value: child.props[Listbox.valuePropertyKey],
                    displayString: child.props[Listbox.displayStringPropertyKey],
                };

                return thisItemData;
            }
        );

        this.updateSelection(newSelectedItems);
    };

    /**
     * Function called by child select options when they have been focused
     * Ensure we always validate our internal state on item focus events, otherwise
     * the component can get out of sync from click events
     */
    private listboxItemfocused = (
        item: ListboxItemData,
        event: React.FocusEvent<HTMLDivElement>
    ): void => {
        const target: Element = event.currentTarget;
        const focusIndex: number = this.domChildren().indexOf(target);

        if (this.isDisabledElement(target)) {
            target.blur();
            return;
        }

        if (!this.props.multiselectable) {
            this.updateSelection([item]);
        }

        if (focusIndex !== this.state.focusIndex && focusIndex !== -1) {
            this.setFocus(focusIndex, focusIndex > this.state.focusIndex ? 1 : -1);
        }
    };

    /**
     * Updates selection state (should be the only place this is done outside of initialization)
     */
    private updateSelection = (newSelection: ListboxItemData[]): void => {
        if (isEqual(newSelection, this.state.selectedItems)) {
            return;
        }

        if (this.props.selectedItems === undefined) {
            this.setState({
                selectedItems: newSelection,
            });
        }

        if (this.props.onSelectionChange) {
            this.props.onSelectionChange(newSelection);
        }
    };
}

export default Listbox;
export * from "./listbox.props";
export { ListboxClassNameContract };
