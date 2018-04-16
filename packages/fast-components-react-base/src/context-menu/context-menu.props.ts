import * as React from "react";
import { IContextMenuClassNameContract, IManagedClasses } from "@microsoft/fast-components-class-name-contracts-base";

export interface IContextMenuHandledProps {
    /**
     * The children of the context-menu-item
     */
    children?: React.ReactNode;

    /**
     * Signifies if the menu is open and intractable. Use this to make the context-menu a controlled component
     */
    open?: boolean;

    /**
     * Called when the context-menu should be opened. Use this if the context-menu is a controlled component
     */
    onOpen?: () => void;

    /**
     * Called when the context-menu should be closed. Use this if the context-menu is a controlled component
     */
    onClose?: () => void;
}

export interface IContextMenuUnhandledProps extends React.HTMLAttributes<HTMLUListElement> {}
export interface IContextMenuManagedClasses extends IManagedClasses<IContextMenuClassNameContract> {}
export type ContextMenuProps = IContextMenuHandledProps & IContextMenuUnhandledProps & IContextMenuManagedClasses;
