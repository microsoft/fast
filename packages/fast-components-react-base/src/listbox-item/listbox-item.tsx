import * as React from "react";
import Foundation, { HandledProps } from "@microsoft/fast-components-foundation-react";
import { get } from "lodash-es";
import { ListboxItemClassNameContract } from "@microsoft/fast-components-class-name-contracts-base";
import {
    ListboxItemHandledProps,
    ListboxItemProps,
    ListboxItemUnhandledProps,
} from "./listbox-item.props";
import {
    ListboxContext,
    ListboxContextType,
    ListboxItemData,
} from "../listbox/listbox-context";
import { KeyCodes } from "@microsoft/fast-web-utilities";

class ListboxItem extends Foundation<
    ListboxItemHandledProps,
    ListboxItemUnhandledProps,
    {}
> {
    public static displayName: string = "ListboxItem";

    public static contextType: React.Context<ListboxContextType> = ListboxContext;

    public static defaultProps: Partial<ListboxItemProps> = {
        disabled: false,
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
        let isSelected: boolean = false;
        if ((this.context as ListboxContextType).listboxSelectedItems !== undefined) {
            isSelected =
                (this.context as ListboxContextType).listboxSelectedItems.filter(
                    (item: ListboxItemData) => {
                        return item.id === this.props.id;
                    }
                ).length === 1;
        }
        return (
            <div
                {...this.unhandledProps()}
                className={this.generateClassNames()}
                role="option"
                id={this.props.id}
                aria-selected={isSelected}
                aria-disabled={this.props.disabled}
                onClick={this.handleClick}
                onFocus={this.handleFocus}
                onKeyDown={this.handleKeyDown}
            >
                {this.props.displayString}
                {this.props.children}
            </div>
        );
    }

    /**
     * Create class-names
     */
    protected generateClassNames(): string {
        let classNames: string = get(this.props, "managedClasses.listboxItem", "");

        if (this.props.disabled) {
            classNames = `${classNames} ${get(
                this.props,
                "managedClasses.listboxItem__disabled",
                ""
            )}`;
        }

        return super.generateClassNames(classNames);
    }

    /**
     * Invoke this option
     */
    private invokeOption(
        event: React.MouseEvent<HTMLDivElement> | React.KeyboardEvent<HTMLDivElement>
    ): void {
        const itemData: ListboxItemData = {
            id: this.props.id,
            value: this.props.value,
            displayString: this.props.displayString,
        };

        if ((this.context as ListboxContextType).listboxItemInvoked) {
            (this.context as ListboxContextType).listboxItemInvoked(itemData, event);
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

        switch (e.keyCode) {
            case KeyCodes.enter:
            case KeyCodes.space:
                e.preventDefault();
                this.invokeOption(e);
                break;
        }

        if (typeof this.props.onKeyDown === "function") {
            this.props.onKeyDown(e);
        }
    };

    /**
     * Handle the keydown event of the item
     */
    private handleClick = (e: React.MouseEvent<HTMLDivElement>): void => {
        if (this.props.disabled) {
            return;
        }

        e.preventDefault();
        this.invokeOption(e);

        if (typeof this.props.onClick === "function") {
            this.props.onClick(e);
        }
    };

    /**
     * Handle focus event
     */
    private handleFocus = (e: React.FocusEvent<HTMLDivElement>): void => {
        if (this.props.disabled) {
            return;
        }

        const itemData: ListboxItemData = {
            id: this.props.id,
            value: this.props.value,
            displayString: this.props.displayString,
        };

        if (
            typeof (this.context as ListboxContextType).listboxItemFocused === "function"
        ) {
            (this.context as ListboxContextType).listboxItemFocused(itemData, e);
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
