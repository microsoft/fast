import * as React from "react";
import { IContextMenuClassNameContract, IManagedClasses } from "@microsoft/fast-components-class-name-contracts";

export interface IContextMenuHandledProps {
    /**
     * The children of the context-menu-item
     */
    children?: React.ReactNode;

    /**
     * Signifies if the menu is open and intractable
     */
    open?: boolean;
}

export interface IContextMenuUnhandledProps extends React.HTMLAttributes<HTMLUListElement> {}
export interface IContextMenuManagedClasses extends IManagedClasses<IContextMenuClassNameContract> {}
export type ContextMenuProps = IContextMenuHandledProps & IContextMenuUnhandledProps & IContextMenuManagedClasses;
