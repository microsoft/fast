import * as ReactDOM from "react-dom";
import Foundation, { HandledProps } from "@microsoft/fast-components-foundation-react";
import { ListboxClassNameContract } from "@microsoft/fast-components-class-name-contracts-base";
import {
    ListboxHandledProps,
    ListboxProps,
    ListboxUnhandledProps,
} from "./listbox.props";
import * as React from "react";
import { KeyCodes, startsWith } from "@microsoft/fast-web-utilities";
import { get, inRange, isEqual } from "lodash-es";
import { canUseDOM } from "exenv-es6";
import { ListboxContext } from "./listbox-context";
import { ListboxItemProps } from "../listbox-item";

export interface ListboxState {
    /**
     * The index of the focusable child
     */
    focusIndex: number;
    focussedItemId: string;
    selectedItems: ListboxItemProps[];
}

class Listbox extends Foundation<
    ListboxHandledProps,
    ListboxUnhandledProps,
    ListboxState
> {
    public static displayName: string = "Listbox";

    public static defaultProps: Partial<ListboxProps> = {
        multiselectable: false,
        defaultSelection: [],
        typeAheadPropertyKey: "displayString",
        focusItemOnMount: false,
    };

    /**
     * converts an array of item id's to an array of ListboxItemProps objects populated by data
     * extracted from the provided children based on id match
     */
    public static getListboxItemDataFromIds(
        selectedIds: Array<string | ListboxItemProps>,
        children: React.ReactNode
    ): ListboxItemProps[] {
        const selectedItems: ListboxItemProps[] = Listbox.validateSelection(
            selectedIds,
            children
        );
        return selectedItems;
    }

    /**
     * returns the the first selectable item in the provided array of children
     */
    public static getFirstValidOptionInRange = (
        startIndex: number,
        endIndex: number,
        childrenAsArray: React.ReactNode[],
        increment: number
    ): React.ReactNode => {
        for (let i: number = startIndex; i !== endIndex; i = 1 + increment) {
            const thisOption: React.ReactNode = childrenAsArray[i] as React.ReactNode;
            if (Listbox.isValidSelectedItem(thisOption as React.ReactElement<any>)) {
                return thisOption;
            }
            return null;
        }
    };

    /**
     * Gets the index of an item from it's id by examining children props
     */
    public static getItemIndexById(itemId: string, children: React.ReactNode): number {
        const childrenAsArray: React.ReactNode[] = React.Children.toArray(children);
        return childrenAsArray.findIndex(
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
    }

    private static valuePropertyKey: string = "value";
    private static idPropertyKey: string = "id";
    private static displayStringPropertyKey: string = "displayString";
    private static disabledPropertyKey: string = "disabled";

    /**
     * tests whether a React.ReactElement is a valid item to select
     * (ie. such an option id exists and the option is not disabled),
     * the values of the returned data objects are updated to reflect values of child object
     * with matching id.
     */
    private static isValidSelectedItem(itemNode: React.ReactElement<any>): boolean {
        if (
            itemNode === undefined ||
            itemNode.props[Listbox.disabledPropertyKey] === true ||
            itemNode.props[Listbox.valuePropertyKey] === undefined
        ) {
            return false;
        }

        return true;
    }

    /**
     * Gets a child node from it's id by examining provided children
     */
    private static getNodeById(
        itemId: string,
        children: React.ReactNode
    ): React.ReactNode {
        const childrenAsArray: React.ReactNode[] = React.Children.toArray(children);

        const matchNode: React.ReactNode = childrenAsArray.find(
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

        return matchNode;
    }

    /**
     * Gets the listItemData of an item from it's id by examining children props
     */
    private static getItemPropsById(
        itemId: string,
        children: React.ReactNode
    ): ListboxItemProps {
        const matchNode: React.ReactNode = this.getNodeById(itemId, children);

        if (matchNode !== undefined) {
            return (matchNode as React.ReactElement<any>).props;
        }

        return null;
    }

    /**
     * validates selected options against child props and returns only the valid ones
     * (ie. such an option id exists and the option is not disabled),
     * the values of the returned data objects are updated to reflect values of child object
     * with matching id.
     */
    private static validateSelection(
        items: Array<string | ListboxItemProps>,
        children: React.ReactNode
    ): ListboxItemProps[] {
        const validSelection: ListboxItemProps[] = items
            .map((item: string | ListboxItemProps) => {
                let itemId: string = "";
                if (typeof item === "string") {
                    itemId = item;
                } else {
                    itemId = item.id;
                }

                const itemNode: React.ReactElement<any> = this.getNodeById(
                    itemId,
                    children
                ) as React.ReactElement<any>;
                if (!Listbox.isValidSelectedItem(itemNode)) {
                    return null;
                }

                return itemNode.props;
            })
            .filter((listboxItem: ListboxItemProps) => {
                return listboxItem !== null;
            });

        return validSelection;
    }

    protected handledProps: HandledProps<ListboxHandledProps> = {
        children: void 0,
        defaultSelection: void 0,
        disabled: void 0,
        labelledBy: void 0,
        managedClasses: void 0,
        multiselectable: void 0,
        onSelectedItemsChanged: void 0,
        selectedItems: void 0,
        typeAheadPropertyKey: void 0,
        focusItemOnMount: void 0,
    };

    private rootElement: React.RefObject<HTMLDivElement> = React.createRef<
        HTMLDivElement
    >();

    private typeAheadString: string = "";
    private typeAheadTimer: NodeJS.Timer;
    private shiftRangeSelectStartIndex: number = -1;

    constructor(props: ListboxProps) {
        super(props);

        let initialSelection: ListboxItemProps[];
        if (this.props.selectedItems !== undefined) {
            initialSelection = Listbox.getListboxItemDataFromIds(
                this.props.selectedItems,
                this.props.children
            );
        } else {
            initialSelection = Listbox.getListboxItemDataFromIds(
                this.props.defaultSelection,
                this.props.children
            );
        }

        if (!this.props.multiselectable && initialSelection.length > 1) {
            initialSelection = initialSelection.slice(0, 1);
        }

        this.state = {
            focusIndex: -1,
            focussedItemId: "",
            selectedItems: initialSelection,
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
                aria-disabled={this.props.disabled || null}
                aria-multiselectable={this.props.multiselectable || null}
                aria-activedescendant={this.state.focussedItemId}
                aria-labelledby={this.props.labelledBy || null}
                className={this.generateClassNames()}
                onKeyDown={this.handleMenuKeyDown}
            >
                <ListboxContext.Provider
                    value={{
                        listboxSelectedItems: this.state.selectedItems,
                        listboxItemFocused: this.listboxItemfocused,
                        listboxItemInvoked: this.listboxItemInvoked,
                        listboxMultiselectable: this.props.multiselectable,
                    }}
                >
                    {this.renderChildren()}
                </ListboxContext.Provider>
            </div>
        );
    }

    public componentDidMount(): void {
        const focusIndex: number =
            this.state.selectedItems.length > 0
                ? Listbox.getItemIndexById(
                      this.state.selectedItems[0].id,
                      this.props.children
                  )
                : this.domChildren().findIndex(this.isFocusableElement);

        if (focusIndex !== -1) {
            if (this.props.focusItemOnMount) {
                this.setFocus(focusIndex, +1);
            }
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
        let className: string = get(this.props.managedClasses, "listbox", "");

        if (this.props.disabled) {
            className = `${className} ${get(
                this.props,
                "managedClasses.listbox__disabled",
                ""
            )}`;
        }

        return super.generateClassNames(className);
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
            element instanceof HTMLElement &&
            element.getAttribute("role") === "option" &&
            !this.isDisabledElement(element) &&
            !this.props.disabled
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
                if (!this.props.disabled) {
                    child.focus();
                }
                break;
            }

            focusIndex += adjustment;
        }

        return focusItemId;
    }

    /**
     * Function called by child select options when they have been focused
     */
    private listboxItemfocused = (
        item: ListboxItemProps,
        event: React.FocusEvent<HTMLDivElement>
    ): void => {
        if (this.props.disabled) {
            return;
        }

        const target: Element = event.currentTarget;
        const focusIndex: number = this.domChildren().indexOf(target);

        if (this.isDisabledElement(target)) {
            target.blur();
            return;
        }

        this.setState({
            focusIndex,
            focussedItemId: item.id,
        });

        if (!this.props.multiselectable) {
            this.updateSelection([item]);
        }
    };

    /**
     * Handle the keydown event of the root menu
     */
    private handleMenuKeyDown = (event: React.KeyboardEvent<HTMLDivElement>): void => {
        if (event.defaultPrevented || this.props.disabled) {
            return;
        }

        let focusItemId: string;

        switch (event.keyCode) {
            case KeyCodes.escape:
            case KeyCodes.enter:
            case KeyCodes.space:
            case KeyCodes.tab:
                return;

            case KeyCodes.arrowDown:
            case KeyCodes.arrowRight:
                focusItemId = this.setFocus(this.state.focusIndex + 1, 1);
                event.preventDefault();
                if (this.props.multiselectable && event.shiftKey && focusItemId !== "") {
                    const itemProps: ListboxItemProps = Listbox.getItemPropsById(
                        focusItemId,
                        this.props.children
                    );
                    if (itemProps !== null) {
                        this.toggleItem(itemProps);
                    }
                }

                break;

            case KeyCodes.arrowUp:
            case KeyCodes.arrowLeft:
                focusItemId = this.setFocus(this.state.focusIndex - 1, -1);
                event.preventDefault();
                if (this.props.multiselectable && event.shiftKey && focusItemId !== "") {
                    const itemData: ListboxItemProps = Listbox.getItemPropsById(
                        focusItemId,
                        this.props.children
                    );
                    if (itemData !== null) {
                        this.toggleItem(itemData);
                    }
                }
                break;

            case KeyCodes.end:
                if (this.props.multiselectable && event.shiftKey && event.ctrlKey) {
                    this.selectRange(
                        this.state.focusIndex,
                        this.domChildren().length - 1
                    );
                }
                this.setFocus(this.domChildren().length - 1, -1);

                break;

            case KeyCodes.home:
                if (this.props.multiselectable && event.shiftKey && event.ctrlKey) {
                    this.selectRange(0, this.state.focusIndex);
                }
                this.setFocus(0, 1);

                break;

            default:
                if (event.key === "A") {
                    this.selectRange(0, this.domChildren().length);
                } else if (!event.ctrlKey) {
                    this.processTypeAhead(event);
                }
        }
    };

    /**
     * Sets focus based on characters typed
     */
    private processTypeAhead = (e: React.KeyboardEvent<HTMLDivElement>): void => {
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
                    startsWith(
                        child.props[this.props.typeAheadPropertyKey].toLowerCase(),
                        this.typeAheadString
                    )
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
        item: ListboxItemProps,
        event: React.MouseEvent<HTMLDivElement> | React.KeyboardEvent<HTMLDivElement>
    ): void => {
        if (this.props.disabled) {
            return;
        }
        const target: Element = event.currentTarget;
        const itemIndex: number = this.domChildren().indexOf(target);
        if (this.props.multiselectable && event.type === "click") {
            if (!event.shiftKey || this.shiftRangeSelectStartIndex === -1) {
                this.shiftRangeSelectStartIndex = itemIndex;
            }
            if (event.ctrlKey) {
                this.toggleItem(item);
            } else if (event.shiftKey) {
                this.selectRange(this.shiftRangeSelectStartIndex, itemIndex);
            } else {
                this.updateSelection([item]);
            }
        } else if (this.props.multiselectable && event.type === "keydown") {
            if (event.shiftKey) {
                this.selectRange(this.shiftRangeSelectStartIndex, itemIndex);
            } else {
                this.toggleItem(item);
            }
        } else {
            this.updateSelection([item]);
        }
    };

    /**
     * Toggle the selection state of the item
     */
    private toggleItem = (item: ListboxItemProps): void => {
        const culledSelection: ListboxItemProps[] = this.state.selectedItems.filter(
            (listboxItem: ListboxItemProps) => {
                return listboxItem.id !== item.id;
            }
        );
        if (culledSelection.length < this.state.selectedItems.length) {
            this.updateSelection(culledSelection);
        } else {
            const newSelectedItems: ListboxItemProps[] = this.state.selectedItems.concat([
                item,
            ]);
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

        const newSelectedItems: ListboxItemProps[] = childrenInRange.map(
            (child: React.ReactElement<any>) => {
                return child.props as ListboxItemProps;
            }
        );

        this.updateSelection(newSelectedItems);
    };

    /**
     * Updates selection state (should be the only place this is done outside of initialization)
     */
    private updateSelection = (newSelection: ListboxItemProps[]): void => {
        const validatedSelection: ListboxItemProps[] = Listbox.validateSelection(
            newSelection,
            this.props.children
        );

        if (isEqual(validatedSelection, this.state.selectedItems)) {
            return;
        }

        if (this.props.selectedItems === undefined) {
            this.setState({
                selectedItems: validatedSelection,
            });
        }

        if (this.props.onSelectedItemsChanged) {
            this.props.onSelectedItemsChanged(validatedSelection);
        }
    };
}

export default Listbox;
export * from "./listbox.props";
export { ListboxClassNameContract };
