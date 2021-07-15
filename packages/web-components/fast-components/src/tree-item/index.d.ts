import { TreeItem, TreeItemOptions } from "@microsoft/fast-foundation";
/**
 * A function that returns a {@link @microsoft/fast-foundation#TreeItem} registration for configuring the component with a DesignSystem.
 * Implements {@link @microsoft/fast-foundation#treeItemTemplate}
 *
 *
 * @public
 * @remarks
 * Generates HTML Element: \<fast-tree-item\>
 *
 */
export declare const fastTreeItem: (
    overrideDefinition?: import("@microsoft/fast-foundation").OverrideFoundationElementDefinition<
        TreeItemOptions
    >
) => import("@microsoft/fast-foundation").FoundationElementRegistry<
    TreeItemOptions,
    import("@microsoft/fast-element").Constructable<
        import("@microsoft/fast-foundation").FoundationElement
    >
>;
/**
 * Styles for TreeItem
 * @public
 */
export declare const treeItemStyles: (
    context: import("@microsoft/fast-foundation").ElementDefinitionContext,
    definition: TreeItemOptions
) => import("@microsoft/fast-element").ElementStyles;
/**
 * Base class for TreeItem
 * @public
 */
export { TreeItem };
