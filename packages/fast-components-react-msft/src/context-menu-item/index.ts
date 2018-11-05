import * as React from "react";
import { ContextMenuItemRole } from "@microsoft/fast-components-react-base";
import MSFTContextMenuItem, {
    ContextMenuItemHandledProps as MSFTContextMenuItemHandledProps,
    ContextMenuItemManagedClasses,
    ContextMenuItemProps as MSFTContextMenuItemProps,
    ContextMenuItemUnhandledProps,
} from "./context-menu-item";
import manageJss, { ManagedJSSProps } from "@microsoft/fast-jss-manager-react";
import { ContextMenuItemClassNameContract } from "@microsoft/fast-components-class-name-contracts-msft";
import {
    ContextMenuItemStyles,
    DesignSystem,
} from "@microsoft/fast-components-styles-msft";
import { Subtract } from "utility-types";

/* tslint:disable-next-line:typedef */
const ContextMenuItem = manageJss(ContextMenuItemStyles)(MSFTContextMenuItem);
type ContextMenuItem = InstanceType<typeof ContextMenuItem>;

interface ContextMenuItemHandledProps
    extends Subtract<MSFTContextMenuItemHandledProps, ContextMenuItemManagedClasses> {}
type ContextMenuItemProps = ManagedJSSProps<
    MSFTContextMenuItemProps,
    ContextMenuItemClassNameContract,
    DesignSystem
>;

export {
    ContextMenuItem,
    ContextMenuItemRole,
    ContextMenuItemProps,
    ContextMenuItemClassNameContract,
    ContextMenuItemHandledProps,
    ContextMenuItemUnhandledProps,
};
