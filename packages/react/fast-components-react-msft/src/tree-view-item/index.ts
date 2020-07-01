import React from "react";
import { TreeViewItemClassNameContract } from "@microsoft/fast-components-class-name-contracts-msft";
import manageJss, { ManagedJSSProps } from "@microsoft/fast-jss-manager-react";
import { DesignSystem, TreeViewItemStyles } from "@microsoft/fast-components-styles-msft";
import treeViewItemSchema from "./tree-view-item.schema";
import treeViewItemSchema2 from "./tree-view-item.schema.2";
import MSFTTreeViewItem, {
    TreeViewItemHandledProps as MSFTTreeViewItemHandledProps,
    TreeViewItemProps as MSFTTreeViewItemProps,
    TreeViewItemManagedClasses,
    TreeViewItemUnhandledProps,
} from "./tree-view-item";

/*
 * The type returned by manageJss type is very complicated so we'll let the
 * compiler infer the type instead of re-declaring just for the package export
 */
const TreeViewItem = manageJss(TreeViewItemStyles)(MSFTTreeViewItem);
type TreeViewItem = InstanceType<typeof TreeViewItem>;

type TreeViewItemHandledProps = Subtract<
    MSFTTreeViewItemHandledProps,
    TreeViewItemManagedClasses
>;
type TreeViewItemProps = ManagedJSSProps<
    MSFTTreeViewItemProps,
    TreeViewItemClassNameContract,
    DesignSystem
>;

export {
    TreeViewItemClassNameContract,
    TreeViewItemHandledProps,
    TreeViewItemUnhandledProps,
    TreeViewItem,
    TreeViewItemProps,
    treeViewItemSchema,
    treeViewItemSchema2,
};
