import React from "react";
import {
    ContextMenuClassNameContract,
    ManagedClasses,
} from "@microsoft/fast-components-class-name-contracts-base";

export type ContextMenuManagedClasses = ManagedClasses<ContextMenuClassNameContract>;
export type ContextMenuUnhandledProps = React.HTMLAttributes<HTMLDivElement>;
export interface ContextMenuHandledProps extends ContextMenuManagedClasses {
    /**
     * The context menu children
     */
    children?: React.ReactNode;

    /**
     * When true, the context menu will immediately place focus on the appropriate menu-item when the context-menu mounts
     */
    enableAutoFocus?: boolean;
}

export type ContextMenuProps = ContextMenuHandledProps & ContextMenuUnhandledProps;
