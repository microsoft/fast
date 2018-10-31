import * as React from "react";
import { Subtract } from "utility-types";
import {
    ContextMenuItemHandledProps as BaseContextMenuItemHandledProps,
    ContextMenuItemManagedClasses as BaseContextMenuItemManagedClasses,
    ContextMenuItemUnhandledProps as BaseContextMenuItemUnhandledProps,
} from "@microsoft/fast-components-react-base";
import {
    ContextMenuItemClassNameContract,
    ManagedClasses,
} from "@microsoft/fast-components-class-name-contracts-msft";

export interface ContextMenuItemManagedClasses
    extends ManagedClasses<ContextMenuItemClassNameContract> {}
export interface ContextMenuItemHandledProps
    extends ContextMenuItemManagedClasses,
        Subtract<BaseContextMenuItemHandledProps, BaseContextMenuItemManagedClasses> {
    before?: React.ReactNode;
}

/* tslint:disable-next-line:no-empty-interface */
export interface ContextMenuItemUnhandledProps
    extends BaseContextMenuItemUnhandledProps {}
export type ContextMenuItemProps = ContextMenuItemHandledProps &
    ContextMenuItemUnhandledProps;
