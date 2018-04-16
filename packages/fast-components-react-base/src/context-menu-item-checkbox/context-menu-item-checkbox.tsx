import * as React from "react";
import Foundation, { HandledProps } from "../foundation";
import {get} from "lodash-es";
import { IContextMenuItemCheckboxClassNameContract } from "@microsoft/fast-components-class-name-contracts-base";
import {
    ContextMenuItemCheckboxProps,
    IContextMenuItemCheckboxHandledProps,
    IContextMenuItemCheckboxManagedClasses,
    IContextMenuItemCheckboxUnhandledProps,
} from "./context-menu-item-checkbox.props";
import {MenuItemRole} from "../utilities/aria";
import {isFunction} from "lodash-es";


class ContextMenuItemCheckbox extends Foundation<IContextMenuItemCheckboxHandledProps & IContextMenuItemCheckboxManagedClasses, IContextMenuItemCheckboxUnhandledProps, {}> {

    protected handledProps: HandledProps<IContextMenuItemCheckboxHandledProps & IContextMenuItemCheckboxManagedClasses> = {
        managedClasses: void 0,
        children: void 0,
        id: void 0,
        onChange: void 0,
        checked: void 0
    };

    /**
     * Renders the component
     */
    public render(): React.ReactElement<HTMLLIElement> {
        return (
            <li
                {...this.unhandledProps()}
                className={this.generateClassNames()}
                id={this.props.id}
                onClick={this.handleClick}
                role={MenuItemRole.menuitemcheckbox}
            >
                {this.props.children}
            </li>
        );
    }

    /**
     * Create class-names
     */
    protected generateClassNames(): string {
        return super.generateClassNames(get(this.props.managedClasses, "contextMenuItemCheckbox"));
    }

    /**
     * Handle click events
     */
    private handleClick = (e: React.MouseEvent<HTMLLIElement>): void => {
        if (!this.props["aria-disabled"] && isFunction(this.props.onChange)) {
            this.props.onChange(this);
        }

        if (isFunction(this.props.onClick)) {
            this.props.onClick(e);
        }
    }
}

export default ContextMenuItemCheckbox;
export * from "./context-menu-item-checkbox.props";
export {IContextMenuItemCheckboxClassNameContract};
