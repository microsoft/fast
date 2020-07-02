import React from "react";
import { ContextMenuClassNameContract } from "@microsoft/fast-components-class-name-contracts-base";
import manageJss, { ManagedJSSProps } from "@microsoft/fast-jss-manager-react";
import { ContextMenuStyles, DesignSystem } from "@microsoft/fast-components-styles-msft";
import contextMenuSchema from "./context-menu.schema";
import contextMenuSchema2 from "./context-menu.schema.2";
import MSFTContextMenu, {
    ContextMenuManagedClasses,
    ContextMenuUnhandledProps,
    ContextMenuHandledProps as MSFTContextMenuHandledProps,
    ContextMenuProps as MSFTContextMenuProps,
} from "./context-menu";
import { Subtract } from "utility-types";

const ContextMenu = manageJss(ContextMenuStyles)(MSFTContextMenu);
type ContextMenu = InstanceType<typeof ContextMenu>;

type ContextMenuHandledProps = Subtract<
    MSFTContextMenuHandledProps,
    ContextMenuManagedClasses
>;
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
    contextMenuSchema2,
    ContextMenuUnhandledProps,
};
