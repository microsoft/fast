import React from "react";
import {
    TreeViewItemHandledProps as BaseTreeViewItemHandledProps,
    TreeViewItemManagedClasses as BaseTreeViewItemManagedClasses,
    TreeViewItemUnhandledProps as BaseTreeViewItemUnhandledProps,
} from "@microsoft/fast-components-react-base";
import {
    ManagedClasses,
    TreeViewItemClassNameContract,
} from "@microsoft/fast-components-class-name-contracts-msft";

export type TreeViewItemManagedClasses = ManagedClasses<TreeViewItemClassNameContract>;
export interface TreeViewItemHandledProps
    extends TreeViewItemManagedClasses,
        Subtract<BaseTreeViewItemHandledProps, BaseTreeViewItemManagedClasses> {
    /**
     * The preceding content
     */
    beforeContent?: (className?: string) => React.ReactNode;

    /**
     * The trailing content
     */
    afterContent?: (className?: string) => React.ReactNode;
}

export type TreeViewItemUnhandledProps = BaseTreeViewItemUnhandledProps;
export type TreeViewItemProps = TreeViewItemHandledProps & TreeViewItemUnhandledProps;
