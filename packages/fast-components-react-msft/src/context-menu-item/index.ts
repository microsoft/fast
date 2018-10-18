import * as React from "react";
import {
    ContextMenuItem as BaseContextMenuItem,
    ContextMenuItemClassNameContract,
    ContextMenuItemHandledProps as BaseContextMenuItemHandledProps,
    ContextMenuItemManagedClasses,
    ContextMenuItemProps as BaseContextMenuItemProps,
    ContextMenuItemUnhandledProps,
} from "@microsoft/fast-components-react-base";
import manageJss, { ManagedJSSProps } from "@microsoft/fast-jss-manager-react";
import {
    ContextMenuItemStyles,
    DesignSystem,
} from "@microsoft/fast-components-styles-msft";
import { Subtract } from "utility-types";

/* tslint:disable-next-line:typedef */
const ContextMenuItem = manageJss(ContextMenuItemStyles)(BaseContextMenuItem);
type ContextMenuItem = typeof ContextMenuItem;

interface ContextMenuItemHandledProps
    extends Subtract<BaseContextMenuItemHandledProps, ContextMenuItemManagedClasses> {}
type ContextMenuItemProps = ManagedJSSProps<
    BaseContextMenuItemProps,
    ContextMenuItemClassNameContract,
    DesignSystem
>;

export {
    ContextMenuItem,
    ContextMenuItemProps,
    ContextMenuItemClassNameContract,
    ContextMenuItemHandledProps,
    ContextMenuItemUnhandledProps,
};
