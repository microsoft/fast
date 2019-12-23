import React from "react";
import { ManagedClasses } from "@microsoft/fast-components-class-name-contracts-base";

export interface TreeViewClassNameContract {
    treeView: string;
}

export interface TreeViewManagedClasses
    extends ManagedClasses<TreeViewClassNameContract> {}

export interface TreeViewUnhandledProps extends React.HTMLAttributes<HTMLDivElement> {}

export interface TreeViewHandledProps extends TreeViewManagedClasses {
    children: React.ReactNode;
}

export type TreeViewProps = TreeViewHandledProps & TreeViewUnhandledProps;
