import * as React from "react";
import Foundation, { HandledProps } from "../foundation";
import { IContextMenuClassNameContract } from "@microsoft/fast-components-class-name-contracts";
import {
    ContextMenuProps,
    IContextMenuHandledProps,
    IContextMenuManagedClasses,
    IContextMenuUnhandledProps,
} from "./context-menu.props";

/* tslint:disable-next-line */
class ContextMenu extends Foundation<IContextMenuHandledProps & IContextMenuManagedClasses, IContextMenuUnhandledProps, {}> {
    public static defaultProps: IContextMenuHandledProps = {
        open: false
    };

    protected handledProps: HandledProps<IContextMenuHandledProps & IContextMenuManagedClasses> = {
        children: void 0,
        managedClasses: void 0,
        open: void 0
    };

    /**
     * Renders the component
     */
    public render(): React.ReactElement<HTMLUListElement> {
        return (
            <ul
                aria-hidden={!this.props.open}
                className={this.generateClassNames()}
                tabIndex={0}
            >
                {this.props.children}
            </ul>
        );
    }

    /**
     * Create class-names
     */
    protected generateClassNames(): string {
        return super.generateClassNames(this.props.managedClasses.contextMenu);
    }
}


export default ContextMenu;
export * from "./context-menu.props";
export {IContextMenuClassNameContract};
