import { Skeleton } from "@microsoft/fast-foundation";
/**
 * A function that returns a {@link @microsoft/fast-foundation#Skeleton} registration for configuring the component with a DesignSystem.
 * Implements {@link @microsoft/fast-foundation#skeletonTemplate}
 *
 *
 * @public
 * @remarks
 * Generates HTML Element: \<fast-skeleton\>
 */
export declare const fastSkeleton: (
    overrideDefinition?: import("@microsoft/fast-foundation").OverrideFoundationElementDefinition<
        import("@microsoft/fast-foundation").FoundationElementDefinition
    >
) => import("@microsoft/fast-foundation").FoundationElementRegistry<
    import("@microsoft/fast-foundation").FoundationElementDefinition,
    typeof Skeleton
>;
/**
 * Styles for Skeleton
 * @public
 */
export declare const skeletonStyles: (
    context: import("@microsoft/fast-foundation").ElementDefinitionContext,
    definition: import("@microsoft/fast-foundation").FoundationElementDefinition
) => import("@microsoft/fast-element").ElementStyles;
/**
 * Base class for Skeleton
 * @public
 */
export { Skeleton };
