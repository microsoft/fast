import React from "react";
import { Subtract } from "utility-types";
import {
    TreeViewItemHandledProps as BaseTreeViewItemHandledProps,
    TreeViewItemManagedClasses as BaseTreeViewItemManagedClasses,
    TreeViewItemUnhandledProps as BaseTreeViewItemUnhandledProps,
} from "@microsoft/fast-components-react-base";
import {
    ManagedClasses,
    TreeViewItemClassNameContract,
} from "@microsoft/fast-components-class-name-contracts-msft";

export interface TreeViewItemManagedClasses
    extends ManagedClasses<TreeViewItemClassNameContract> {}
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

/* tslint:disable-next-line:no-empty-interface */
export interface TreeViewItemUnhandledProps extends BaseTreeViewItemUnhandledProps {}
export type TreeViewItemProps = TreeViewItemHandledProps & TreeViewItemUnhandledProps;
