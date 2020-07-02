import React from "react";
import {
    ContextMenuItemHandledProps as BaseContextMenuItemHandledProps,
    ContextMenuItemManagedClasses as BaseContextMenuItemManagedClasses,
    ContextMenuItemUnhandledProps as BaseContextMenuItemUnhandledProps,
} from "@microsoft/fast-components-react-base";
import {
    ContextMenuItemClassNameContract,
    ManagedClasses,
} from "@microsoft/fast-components-class-name-contracts-msft";

export type ContextMenuItemManagedClasses = ManagedClasses<
    ContextMenuItemClassNameContract
>;
export interface ContextMenuItemHandledProps
    extends ContextMenuItemManagedClasses,
        Omit<BaseContextMenuItemHandledProps, keyof BaseContextMenuItemManagedClasses> {
    /**
     * The element that comes after the primary content
     */
    after?: React.ReactNode;

    /**
     * The element that comes before the primary content
     */
    before?: React.ReactNode;
}

export type ContextMenuItemUnhandledProps = BaseContextMenuItemUnhandledProps;
export type ContextMenuItemProps = ContextMenuItemHandledProps &
    ContextMenuItemUnhandledProps;
