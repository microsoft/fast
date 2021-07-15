import { Combobox, ComboboxOptions } from "@microsoft/fast-foundation";
/**
 * A function that returns a {@link @microsoft/fast-foundation#Combobox} registration for configuring the component with a DesignSystem.
 * Implements {@link @microsoft/fast-foundation#comboboxTemplate}
 *
 * @public
 * @remarks
 * Generates HTML Element: \<fast-combobox\>
 *
 */
export declare const fastCombobox: (
    overrideDefinition?: import("@microsoft/fast-foundation").OverrideFoundationElementDefinition<
        ComboboxOptions
    >
) => import("@microsoft/fast-foundation").FoundationElementRegistry<
    ComboboxOptions,
    import("@microsoft/fast-element").Constructable<
        import("@microsoft/fast-foundation").FoundationElement
    >
>;
/**
 * Styles for combobox
 * @public
 */
export declare const comboboxStyles: (
    context: import("@microsoft/fast-foundation").ElementDefinitionContext,
    definition: ComboboxOptions
) => import("@microsoft/fast-element").ElementStyles;
/**
 * Base class for Combobox
 * @public
 */
export { Combobox };
