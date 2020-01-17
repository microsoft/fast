import React from "react";
import MSFTContextMenu, {
    ContextMenuHandledProps as MSFTContextMenuHandledProps,
    ContextMenuManagedClasses,
    ContextMenuProps as MSFTContextMenuProps,
    ContextMenuUnhandledProps,
} from "./context-menu";
import { ContextMenuClassNameContract } from "@microsoft/fast-components-class-name-contracts-base";
import contextMenuSchema from "./context-menu.schema";
import manageJss, { ManagedJSSProps } from "@microsoft/fast-jss-manager-react";
import { ContextMenuStyles, DesignSystem } from "@microsoft/fast-components-styles-msft";
import { Subtract } from "utility-types";

/* tslint:disable-next-line:typedef */
const ContextMenu = manageJss(ContextMenuStyles)(MSFTContextMenu);
type ContextMenu = InstanceType<typeof ContextMenu>;

interface ContextMenuHandledProps
    extends Subtract<MSFTContextMenuHandledProps, ContextMenuManagedClasses> {}
type ContextMenuProps = ManagedJSSProps<
    MSFTContextMenuProps,
    ContextMenuClassNameContract,
    DesignSystem
>;

export {
    ContextMenu,
    ContextMenuProps,
    ContextMenuClassNameContract,
    ContextMenuHandledProps,
    contextMenuSchema,
    ContextMenuUnhandledProps,
};
