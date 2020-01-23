import React from "react";
import { Subtract } from "utility-types";
import {
    ContextMenuHandledProps as BaseContextMenuHandledProps,
    ContextMenuManagedClasses as BaseContextMenuManagedClasses,
    ContextMenuUnhandledProps as BaseContextMenuUnhandledProps,
} from "@microsoft/fast-components-react-base";
import {
    ContextMenuClassNameContract,
    ManagedClasses,
} from "@microsoft/fast-components-class-name-contracts-base";

export interface ContextMenuManagedClasses
    extends ManagedClasses<ContextMenuClassNameContract> {}
export interface ContextMenuHandledProps
    extends ContextMenuManagedClasses,
        Subtract<BaseContextMenuHandledProps, BaseContextMenuManagedClasses> {}

/* tslint:disable-next-line:no-empty-interface */
export interface ContextMenuUnhandledProps extends BaseContextMenuUnhandledProps {}
export type ContextMenuProps = ContextMenuHandledProps & ContextMenuUnhandledProps;
