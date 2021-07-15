import { Menu } from "@microsoft/fast-foundation";
/**
 * A function that returns a {@link @microsoft/fast-foundation#Menu} registration for configuring the component with a DesignSystem.
 * Implements {@link @microsoft/fast-foundation#menuTemplate}
 *
 *
 * @public
 * @remarks
 * Generates HTML Element: \<fast-menu\>
 */
export declare const fastMenu: (
    overrideDefinition?: import("@microsoft/fast-foundation").OverrideFoundationElementDefinition<
        import("@microsoft/fast-foundation").FoundationElementDefinition
    >
) => import("@microsoft/fast-foundation").FoundationElementRegistry<
    import("@microsoft/fast-foundation").FoundationElementDefinition,
    typeof Menu
>;
/**
 * Styles for Menu
 * @public
 */
export declare const menuStyles: (
    context: import("@microsoft/fast-foundation").ElementDefinitionContext,
    definition: import("@microsoft/fast-foundation").FoundationElementDefinition
) => import("@microsoft/fast-element").ElementStyles;
/**
 * Base class for Menu
 * @public
 */
export { Menu };
