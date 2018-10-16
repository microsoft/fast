import * as React from "react";
import { ContextMenuItemClassNameContract, ManagedClasses } from "@microsoft/fast-components-class-name-contracts-base";

export interface ContextMenuItemManagedClasses extends ManagedClasses<ContextMenuItemClassNameContract> {}
export interface ContextMenuItemUnhandledProps extends React.LiHTMLAttributes<HTMLLIElement> {}
export interface ContextMenuItemHandledProps extends ContextMenuItemManagedClasses {
    /**
     * The id attribute of the context-menu-item
     */
    id: string;

    /**
     * The children of the context-menu-item
     */
    children?: React.ReactNode;
}

export type ContextMenuItemProps = ContextMenuItemHandledProps & ContextMenuItemUnhandledProps;
