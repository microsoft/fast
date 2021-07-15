import { Listbox } from "@microsoft/fast-foundation";
/**
 * A function that returns a {@link @microsoft/fast-foundation#Listbox} registration for configuring the component with a DesignSystem.
 * Implements {@link @microsoft/fast-foundation#listboxTemplate}
 *
 *
 * @public
 * @remarks
 * Generates HTML Element: \<fast-listbox\>
 *
 */
export declare const fastListbox: (
    overrideDefinition?: import("@microsoft/fast-foundation").OverrideFoundationElementDefinition<
        import("@microsoft/fast-foundation").FoundationElementDefinition
    >
) => import("@microsoft/fast-foundation").FoundationElementRegistry<
    import("@microsoft/fast-foundation").FoundationElementDefinition,
    typeof Listbox
>;
/**
 * Styles for Listbox
 * @public
 */
export declare const listboxStyles: (
    context: import("@microsoft/fast-foundation").ElementDefinitionContext,
    definition: import("@microsoft/fast-foundation").FoundationElementDefinition
) => import("@microsoft/fast-element").ElementStyles;
/**
 * Base class for Listbox
 * @public
 */
export { Listbox };
