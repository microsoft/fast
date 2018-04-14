import * as React from "react";
import Foundation, { HandledProps } from "../foundation";
import {get} from "lodash-es";
import { IContextMenuItemRadioClassNameContract } from "@microsoft/fast-components-class-name-contracts";
import {
    ContextMenuItemRadioProps,
    IContextMenuItemRadioHandledProps,
    IContextMenuItemRadioManagedClasses,
    IContextMenuItemRadioUnhandledProps,
} from "./context-menu-item-radio.props";
import {MenuItemRole} from "../utilities/aria";
import {isFunction} from "lodash-es";


class ContextMenuItemRadio extends Foundation<IContextMenuItemRadioHandledProps & IContextMenuItemRadioManagedClasses, IContextMenuItemRadioUnhandledProps, {}> {
    public readonly role: string = MenuItemRole.menuitemradio;

    protected handledProps: HandledProps<IContextMenuItemRadioHandledProps & IContextMenuItemRadioManagedClasses> = {
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
                role={this.role}
            >
                {this.props.children}
            </li>
        );
    }

    /**
     * Create class-names
     */
    protected generateClassNames(): string {
        return super.generateClassNames(get(this.props.managedClasses, "contextMenuItemRadio"));
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

export default ContextMenuItemRadio;
export * from "./context-menu-item-radio.props";
export {IContextMenuItemRadioClassNameContract};

