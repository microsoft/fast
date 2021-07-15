import { AnchoredRegion } from "@microsoft/fast-foundation";
/**
 * A function that returns a {@link @microsoft/fast-foundation#AnchoredRegion} registration for configuring the component with a DesignSystem.
 * Implements {@link @microsoft/fast-foundation#anchoredRegionTemplate}
 *
 *
 * @beta
 * @remarks
 * Generates HTML Element: \<fast-anchored-region\>
 */
export declare const fastAnchoredRegion: (
    overrideDefinition?: import("@microsoft/fast-foundation").OverrideFoundationElementDefinition<
        import("@microsoft/fast-foundation").FoundationElementDefinition
    >
) => import("@microsoft/fast-foundation").FoundationElementRegistry<
    import("@microsoft/fast-foundation").FoundationElementDefinition,
    typeof AnchoredRegion
>;
/**
 * Styles for AnchoredRegion
 * @public
 */
export declare const anchoredRegionStyles: (
    context: import("@microsoft/fast-foundation").ElementDefinitionContext,
    definition: import("@microsoft/fast-foundation").FoundationElementDefinition
) => import("@microsoft/fast-element").ElementStyles;
/**
 * Base class for AnchoredRegion
 * @public
 */
export { AnchoredRegion };
