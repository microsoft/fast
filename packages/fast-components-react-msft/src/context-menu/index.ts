import * as React from "react";
import {
    ContextMenu as BaseContextMenu,
    ContextMenuClassNameContract,
    ContextMenuHandledProps as BaseContextMenuHandledProps,
    ContextMenuManagedClasses,
    ContextMenuProps as BaseContextMenuProps,
    ContextMenuUnhandledProps,
} from "@microsoft/fast-components-react-base";
import manageJss, { ManagedJSSProps } from "@microsoft/fast-jss-manager-react";
import { ContextMenuStyles, DesignSystem } from "@microsoft/fast-components-styles-msft";
import { Subtract } from "utility-types";

/* tslint:disable-next-line:typedef */
const ContextMenu = manageJss(ContextMenuStyles)(BaseContextMenu);
type ContextMenu = InstanceType<typeof ContextMenu>;

interface ContextMenuHandledProps
    extends Subtract<BaseContextMenuHandledProps, ContextMenuManagedClasses> {}
type ContextMenuProps = ManagedJSSProps<
    BaseContextMenuProps,
    ContextMenuClassNameContract,
    DesignSystem
>;

export {
    ContextMenu,
    ContextMenuProps,
    ContextMenuClassNameContract,
    ContextMenuHandledProps,
    ContextMenuUnhandledProps,
};
