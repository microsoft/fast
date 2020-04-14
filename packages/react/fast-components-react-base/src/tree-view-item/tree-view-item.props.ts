import React from "react";
import { ManagedClasses } from "@microsoft/fast-components-class-name-contracts-base";
import { TreeViewItemClassNameContract } from "@microsoft/fast-components-class-name-contracts-base";

export type TreeViewItemManagedClasses = ManagedClasses<TreeViewItemClassNameContract>;

export type TreeViewItemUnhandledProps = React.HTMLAttributes<HTMLDivElement>;

export interface TreeViewItemHandledProps extends TreeViewItemManagedClasses {
    /**
     * Renders the items expand/collapse glyph
     */
    expandCollapseGlyph?: (className?: string) => React.ReactNode;

    /**
     * The expanded state of the tree view item on mount.
     * After mounting, the tree view item will track the expanded
     * state internally to align to accessibility guidelines.
     * This property will have no effect if the item has no child nodes
     */
    defaultExpanded?: boolean;

    /**
     * The title content of the tree view item
     */
    titleContent: React.ReactNode;

    /**
     * The selected state of the tree-view-item.
     */
    selected?: boolean;

    /**
     * The children of the tree-item. The intended children of the tree-view-item
     * is additional tree-view-items
     */
    children?: React.ReactNode;

    /**
     * Callback to get notified when the expanded state of a node changes
     */
    onExpandedChange?: (expanded: boolean, props: TreeViewItemProps) => void;

    /**
     * Callback to get notified when the item is selected by the user
     */
    onSelected?: (
        props: TreeViewItemProps,
        e?: React.MouseEvent<HTMLDivElement> | React.KeyboardEvent<HTMLDivElement>
    ) => void;

    /**
     * Function which connects the draggable element
     */
    dragConnect?: (dragElement: React.ReactElement<any>) => React.ReactElement<any>;
}

export type TreeViewItemProps = TreeViewItemHandledProps & TreeViewItemUnhandledProps;
