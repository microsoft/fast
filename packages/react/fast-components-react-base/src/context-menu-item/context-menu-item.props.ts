import React from "react";
import {
    ContextMenuItemClassNameContract,
    ManagedClasses,
} from "@microsoft/fast-components-class-name-contracts-base";
import { ContextMenuItemRole } from "./context-menu-item";

export type ContextMenuItemManagedClasses = ManagedClasses<
    ContextMenuItemClassNameContract
>;
export type ContextMenuItemUnhandledProps = Omit<
    React.HTMLAttributes<HTMLDivElement>,
    "role"
>;
export interface ContextMenuItemHandledProps extends ContextMenuItemManagedClasses {
    /**
     * The children of the context menu item
     */
    children?: React.ReactNode;

    /**
     * The item's role
     */
    role?: ContextMenuItemRole;

    /**
     * If the menu item is disabled
     */
    disabled?: boolean;

    /**
     * Callback for when an item is invoked
     * Returns the prop contract for the invoked context menu item
     */
    onInvoke?: (
        e: React.MouseEvent<HTMLDivElement> | React.KeyboardEvent<HTMLDivElement>,
        props: ContextMenuItemProps
    ) => void;
}

export type ContextMenuItemProps = ContextMenuItemHandledProps &
    ContextMenuItemUnhandledProps;
