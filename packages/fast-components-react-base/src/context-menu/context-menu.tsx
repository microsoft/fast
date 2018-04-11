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
    public static defaultProps: IContextMenuHandledProps = {};

    protected handledProps: HandledProps<IContextMenuHandledProps & IContextMenuManagedClasses> = {
        managedClasses: void 0,
        children: void 0
    };

    /**
     * Renders the component
     */
    public render(): React.ReactElement<HTMLUListElement> {
        return (
            <ul>
                { this.props.children }
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
