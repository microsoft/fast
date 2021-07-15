import { Divider } from "@microsoft/fast-foundation";
/**
 * A function that returns a {@link @microsoft/fast-foundation#Divider} registration for configuring the component with a DesignSystem.
 * Implements {@link @microsoft/fast-foundation#dividerTemplate}
 *
 *
 * @public
 * @remarks
 * Generates HTML Element: \<fast-divider\>
 */
export declare const fastDivider: (
    overrideDefinition?: import("@microsoft/fast-foundation").OverrideFoundationElementDefinition<
        import("@microsoft/fast-foundation").FoundationElementDefinition
    >
) => import("@microsoft/fast-foundation").FoundationElementRegistry<
    import("@microsoft/fast-foundation").FoundationElementDefinition,
    typeof Divider
>;
/**
 * Styles for Divider
 * @public
 */
export declare const dividerStyles: (
    context: import("@microsoft/fast-foundation").ElementDefinitionContext,
    definition: import("@microsoft/fast-foundation").FoundationElementDefinition
) => import("@microsoft/fast-element").ElementStyles;
/**
 * Base class for Divider
 * @public
 */
export { Divider };
