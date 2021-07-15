import { Select, SelectOptions } from "@microsoft/fast-foundation";
/**
 * A function that returns a {@link @microsoft/fast-foundation#Select} registration for configuring the component with a DesignSystem.
 * Implements {@link @microsoft/fast-foundation#selectTemplate}
 *
 *
 * @public
 * @remarks
 * Generates HTML Element: \<fast-select\>
 *
 */
export declare const fastSelect: (
    overrideDefinition?: import("@microsoft/fast-foundation").OverrideFoundationElementDefinition<
        SelectOptions
    >
) => import("@microsoft/fast-foundation").FoundationElementRegistry<
    SelectOptions,
    import("@microsoft/fast-element").Constructable<
        import("@microsoft/fast-foundation").FoundationElement
    >
>;
/**
 * Styles for Select
 * @public
 */
export declare const selectStyles: (
    context: import("@microsoft/fast-foundation").ElementDefinitionContext,
    definition: SelectOptions
) => import("@microsoft/fast-element").ElementStyles;
/**
 * Base class for Select
 * @public
 */
export { Select };
