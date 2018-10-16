import * as React from "react";
import { ContextMenuClassNameContract, ManagedClasses } from "@microsoft/fast-components-class-name-contracts-base";

export interface ContextMenuManagedClasses extends ManagedClasses<ContextMenuClassNameContract> {}
export interface ContextMenuUnhandledProps extends React.HTMLAttributes<HTMLUListElement> {}
export interface ContextMenuHandledProps extends ContextMenuManagedClasses {
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

export type ContextMenuProps = ContextMenuHandledProps & ContextMenuUnhandledProps;
