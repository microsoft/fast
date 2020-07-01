import React from "react";
import {
    ContextMenuHandledProps as BaseContextMenuHandledProps,
    ContextMenuManagedClasses as BaseContextMenuManagedClasses,
    ContextMenuUnhandledProps as BaseContextMenuUnhandledProps,
} from "@microsoft/fast-components-react-base";
import {
    ContextMenuClassNameContract,
    ManagedClasses,
} from "@microsoft/fast-components-class-name-contracts-base";

export type ContextMenuManagedClasses = ManagedClasses<ContextMenuClassNameContract>;
export interface ContextMenuHandledProps
    extends ContextMenuManagedClasses,
        Subtract<BaseContextMenuHandledProps, BaseContextMenuManagedClasses> {}

export type ContextMenuUnhandledProps = BaseContextMenuUnhandledProps;
export type ContextMenuProps = ContextMenuHandledProps & ContextMenuUnhandledProps;
