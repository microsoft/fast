import * as React from "react";
import { IContextMenuItemClassNameContract, IManagedClasses } from "@microsoft/fast-components-class-name-contracts-base";

export interface IContextMenuItemHandledProps {
    /**
     * The id attribute of the context-menu-item
     */
    id: string;

    /**
     * The children of the context-menu-item
     */
    children?: React.ReactNode;
}

export interface IContextMenuItemUnhandledProps extends React.LiHTMLAttributes<HTMLLIElement> {}
export interface IContextMenuItemManagedClasses extends IManagedClasses<IContextMenuItemClassNameContract> {}
export type ContextMenuItemProps = IContextMenuItemHandledProps & IContextMenuItemUnhandledProps & IContextMenuItemManagedClasses;
