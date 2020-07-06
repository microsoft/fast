import React from "react";
import {
    TreeView as BaseTreeView,
    TreeViewHandledProps as BaseTreeViewHandledProps,
    TreeViewProps as BaseTreeViewProps,
    TreeViewClassNameContract,
    TreeViewManagedClasses,
    TreeViewUnhandledProps,
} from "@microsoft/fast-components-react-base";
import manageJss, { ManagedJSSProps } from "@microsoft/fast-jss-manager-react";
import { DesignSystem, TreeViewStyles } from "@microsoft/fast-components-styles-msft";
import treeViewSchema from "./tree-view.schema";
import treeViewSchema2 from "./tree-view.schema.2";

/*
 * The type returned by manageJss type is very complicated so we'll let the
 * compiler infer the type instead of re-declaring just for the package export
 */
const TreeView = manageJss(TreeViewStyles)(BaseTreeView);
type TreeView = InstanceType<typeof TreeView>;

type TreeViewHandledProps = Omit<BaseTreeViewHandledProps, keyof TreeViewManagedClasses>;
type TreeViewProps = ManagedJSSProps<
    BaseTreeViewProps,
    TreeViewClassNameContract,
    DesignSystem
>;

export {
    TreeView,
    TreeViewClassNameContract,
    TreeViewHandledProps,
    TreeViewUnhandledProps,
    TreeViewProps,
    treeViewSchema,
    treeViewSchema2,
};
