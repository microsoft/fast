import { Dialog } from "@microsoft/fast-foundation";
/**
 * A function that returns a {@link @microsoft/fast-foundation#Dialog} registration for configuring the component with a DesignSystem.
 * Implements {@link @microsoft/fast-foundation#dialogTemplate}
 *
 *
 * @public
 * @remarks
 * Generates HTML Element: \<fast-dialog\>
 */
export declare const fastDialog: (
    overrideDefinition?: import("@microsoft/fast-foundation").OverrideFoundationElementDefinition<
        import("@microsoft/fast-foundation").FoundationElementDefinition
    >
) => import("@microsoft/fast-foundation").FoundationElementRegistry<
    import("@microsoft/fast-foundation").FoundationElementDefinition,
    typeof Dialog
>;
/**
 * Styles for Dialog
 * @public
 */
export declare const dialogStyles: (
    context: import("@microsoft/fast-foundation").ElementDefinitionContext,
    definition: import("@microsoft/fast-foundation").FoundationElementDefinition
) => import("@microsoft/fast-element").ElementStyles;
/**
 * Base class for Dialog
 * @public
 */
export { Dialog };
