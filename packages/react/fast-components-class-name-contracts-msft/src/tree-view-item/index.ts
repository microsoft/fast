import { TreeViewItemClassNameContract as BaseTreeViewItemClassNameContract } from "@microsoft/fast-components-class-name-contracts-base";

/**
 * The class name contract for the tree view component
 */
export interface TreeViewItemClassNameContract extends BaseTreeViewItemClassNameContract {
    /**
     * The tree view item before content
     */
    treeViewItem_beforeContent?: string;

    /**
     * The tree view item after content
     */
    treeViewItem_afterContent?: string;
}
