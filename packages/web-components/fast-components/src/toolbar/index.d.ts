import { Toolbar as FoundationToolbar } from "@microsoft/fast-foundation";
/**
 * @internal
 */
export declare class Toolbar extends FoundationToolbar {
    connectedCallback(): void;
}
/**
 * A function that returns a {@link @microsoft/fast-foundation#Toolbar} registration for configuring the component with a DesignSystem.
 * Implements {@link @microsoft/fast-foundation#ToolbarTemplate}
 *
 * @public
 * @remarks
 *
 * Generates HTML Element: \<fast-toolbar\>
 *
 */
export declare const fastToolbar: (
    overrideDefinition?: import("@microsoft/fast-foundation").OverrideFoundationElementDefinition<
        import("@microsoft/fast-foundation").FoundationElementDefinition
    >
) => import("@microsoft/fast-foundation").FoundationElementRegistry<
    import("@microsoft/fast-foundation").FoundationElementDefinition,
    typeof Toolbar
>;
/**
 * Styles for Toolbar.
 * @public
 */
export declare const toolbarStyles: (
    context: import("@microsoft/fast-foundation").ElementDefinitionContext,
    definition: import("@microsoft/fast-foundation").FoundationElementDefinition
) => import("@microsoft/fast-element").ElementStyles;
