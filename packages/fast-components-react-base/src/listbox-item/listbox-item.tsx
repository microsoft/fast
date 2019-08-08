import { ListboxItemClassNameContract } from "@microsoft/fast-components-class-name-contracts-base";
import Foundation, { HandledProps } from "@microsoft/fast-components-foundation-react";
import { classNames, keyCodeEnter, keyCodeSpace } from "@microsoft/fast-web-utilities";
import React from "react";
import { ListboxContext, ListboxContextType } from "../listbox/listbox-context";
import { DisplayNamePrefix } from "../utilities";
import {
    ListboxItemHandledProps,
    ListboxItemProps,
    ListboxItemUnhandledProps,
} from "./listbox-item.props";

class ListboxItem extends Foundation<
    ListboxItemHandledProps,
    ListboxItemUnhandledProps,
    {}
> {
    public static displayName: string = `${DisplayNamePrefix}ListboxItem`;

    public static contextType: React.Context<ListboxContextType> = ListboxContext;

    public static defaultProps: Partial<ListboxItemProps> = {
        disabled: false,
        managedClasses: {},
    };

    protected handledProps: HandledProps<ListboxItemHandledProps> = {
        disabled: void 0,
        displayString: void 0,
        managedClasses: void 0,
        id: void 0,
        onInvoke: void 0,
        value: void 0,
    };

    /**
     * Renders the component
     */
    public render(): React.ReactElement<HTMLDivElement> {
        return (
            <div
                {...this.unhandledProps()}
                className={this.generateClassNames()}
                role="option"
                id={this.props.id}
                aria-selected={this.isItemSelected()}
                aria-disabled={this.props.disabled}
                onClick={this.handleClick}
                onFocus={this.handleFocus}
                onKeyDown={this.handleKeyDown}
            >
                {this.props.children}
            </div>
        );
    }

    /**
     * Create class-names
     */
    protected generateClassNames(): string {
        const {
            listboxItem,
            listboxItem__disabled,
            listboxItem__selected,
        }: ListboxItemClassNameContract = this.props.managedClasses;

        return super.generateClassNames(
            classNames(
                listboxItem,
                [listboxItem__disabled, this.props.disabled],
                [listboxItem__selected, this.isItemSelected()]
            )
        );
    }

    /**
     * Check context to determine if this item is selected
     */
    private isItemSelected = (): boolean => {
        let isSelected: boolean = false;
        if ((this.context as ListboxContextType).listboxSelectedItems !== undefined) {
            isSelected =
                (this.context as ListboxContextType).listboxSelectedItems.filter(
                    (item: ListboxItemProps) => {
                        return item.id === this.props.id;
                    }
                ).length === 1;
        }
        return isSelected;
    };

    /**
     * Invoke this option
     */
    private invokeOption(
        event: React.MouseEvent<HTMLDivElement> | React.KeyboardEvent<HTMLDivElement>
    ): void {
        if ((this.context as ListboxContextType).listboxItemInvoked) {
            (this.context as ListboxContextType).listboxItemInvoked(this.props, event);
        }

        if (typeof this.props.onInvoke === "function") {
            this.props.onInvoke(event, this.props);
        }
    }

    /**
     * Handle the keydown event of the item
     */
    private handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>): void => {
        if (this.props.disabled) {
            return;
        }

        if (typeof this.props.onKeyDown === "function") {
            this.props.onKeyDown(e);
        }

        if (e.defaultPrevented) {
            return;
        }

        switch (e.keyCode) {
            case keyCodeEnter:
            case keyCodeSpace:
                this.invokeOption(e);
                break;
        }
    };

    /**
     * Handle the keydown event of the item
     */
    private handleClick = (e: React.MouseEvent<HTMLDivElement>): void => {
        if (this.props.disabled) {
            return;
        }

        if (typeof this.props.onClick === "function") {
            this.props.onClick(e);
        }

        if (e.defaultPrevented) {
            return;
        }

        this.invokeOption(e);
    };

    /**
     * Handle focus event
     */
    private handleFocus = (e: React.FocusEvent<HTMLDivElement>): void => {
        if (this.props.disabled) {
            return;
        }

        if (
            typeof (this.context as ListboxContextType).listboxItemFocused === "function"
        ) {
            (this.context as ListboxContextType).listboxItemFocused(this.props, e);
        }

        if (typeof this.props.onFocus === "function") {
            this.props.onFocus(e);
        }
    };
}

ListboxItem.contextType = ListboxContext;
export default ListboxItem;
export * from "./listbox-item.props";
export { ListboxItemClassNameContract };
