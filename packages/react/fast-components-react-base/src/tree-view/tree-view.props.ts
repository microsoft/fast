import React from "react";
import { ManagedClasses } from "@microsoft/fast-components-class-name-contracts-base";

export interface TreeViewClassNameContract {
    treeView: string;
}

export type TreeViewManagedClasses = ManagedClasses<TreeViewClassNameContract>;

export type TreeViewUnhandledProps = React.HTMLAttributes<HTMLDivElement>;

export interface TreeViewHandledProps extends TreeViewManagedClasses {
    children: React.ReactNode;
}

export type TreeViewProps = TreeViewHandledProps & TreeViewUnhandledProps;
