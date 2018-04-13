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


class ContextMenuItemRadio extends Foundation<IContextMenuItemRadioHandledProps & IContextMenuItemRadioManagedClasses, IContextMenuItemRadioUnhandledProps, {}> {

    protected handledProps: HandledProps<IContextMenuItemRadioHandledProps & IContextMenuItemRadioManagedClasses> = {
        managedClasses: void 0,
        children: void 0,
        id: void 0,
        onChange: void 0
    };

    /**
     * Renders the component
     */
    public render(): React.ReactElement<HTMLLIElement> {
        return (
            <li
                {...this.unhandledProps()}
                id={this.props.id}
                className={this.generateClassNames()}
                role={MenuItemRole.menuitemradio}
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
}


export default ContextMenuItemRadio;
export * from "./context-menu-item-radio.props";
export {IContextMenuItemRadioClassNameContract};
