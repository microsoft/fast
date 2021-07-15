import { MenuItem, MenuItemOptions } from "@microsoft/fast-foundation";
/**
 * A function that returns a {@link @microsoft/fast-foundation#MenuItem} registration for configuring the component with a DesignSystem.
 * Implements {@link @microsoft/fast-foundation#menuItemTemplate}
 *
 *
 * @public
 * @remarks
 * Generates HTML Element: \<fast-menu-item\>
 */
export declare const fastMenuItem: (
    overrideDefinition?: import("@microsoft/fast-foundation").OverrideFoundationElementDefinition<
        MenuItemOptions
    >
) => import("@microsoft/fast-foundation").FoundationElementRegistry<
    MenuItemOptions,
    import("@microsoft/fast-element").Constructable<
        import("@microsoft/fast-foundation").FoundationElement
    >
>;
/**
 * Styles for MenuItem
 * @public
 */
export declare const menuItemStyles: (
    context: import("@microsoft/fast-foundation").ElementDefinitionContext,
    definition: MenuItemOptions
) => import("@microsoft/fast-element").ElementStyles;
/**
 * Base class for MenuItem
 * @public
 */
export { MenuItem };
