import React from "react";
import {
    TreeView as BaseTreeView,
    TreeViewClassNameContract,
    TreeViewHandledProps as BaseTreeViewHandledProps,
    TreeViewManagedClasses,
    TreeViewProps as BaseTreeViewProps,
    TreeViewUnhandledProps,
} from "@microsoft/fast-components-react-base";
import treeViewSchema from "./tree-view.schema";
import treeViewSchema2 from "./tree-view.schema.2";
import manageJss, { ManagedJSSProps } from "@microsoft/fast-jss-manager-react";
import { DesignSystem, TreeViewStyles } from "@microsoft/fast-components-styles-msft";
import { Subtract } from "utility-types";

/*
 * The type returned by manageJss type is very complicated so we'll let the
 * compiler infer the type instead of re-declaring just for the package export
 */
/* tslint:disable-next-line:typedef */
const TreeView = manageJss(TreeViewStyles)(BaseTreeView);
type TreeView = InstanceType<typeof TreeView>;

interface TreeViewHandledProps
    extends Subtract<BaseTreeViewHandledProps, TreeViewManagedClasses> {}
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
