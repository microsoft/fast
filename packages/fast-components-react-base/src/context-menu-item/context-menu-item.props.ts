import * as React from "react";
import {
    ContextMenuItemClassNameContract,
    ManagedClasses,
} from "@microsoft/fast-components-class-name-contracts-base";
import { ContextMenuItemRole } from "./context-menu-item";
import { Omit } from "utility-types";

export interface ContextMenuItemManagedClasses
    extends ManagedClasses<ContextMenuItemClassNameContract> {}
export interface ContextMenuItemUnhandledProps
    extends Omit<React.HTMLAttributes<HTMLDivElement>, "role"> {}
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
    onInvoke?: (props: ContextMenuItemProps) => void;
}

export type ContextMenuItemProps = ContextMenuItemHandledProps &
    ContextMenuItemUnhandledProps;
