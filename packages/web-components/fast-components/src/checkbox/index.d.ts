import { Checkbox, CheckboxOptions } from "@microsoft/fast-foundation";
/**
 * A function that returns a {@link @microsoft/fast-foundation#Checkbox} registration for configuring the component with a DesignSystem.
 * Implements {@link @microsoft/fast-foundation#checkboxTemplate}
 *
 *
 * @public
 * @remarks
 * Generates HTML Element: \<fast-checkbox\>
 */
export declare const fastCheckbox: (
    overrideDefinition?: import("@microsoft/fast-foundation").OverrideFoundationElementDefinition<
        CheckboxOptions
    >
) => import("@microsoft/fast-foundation").FoundationElementRegistry<
    CheckboxOptions,
    import("@microsoft/fast-element").Constructable<
        import("@microsoft/fast-foundation").FoundationElement
    >
>;
/**
 * Styles for Checkbox
 * @public
 */
export declare const checkboxStyles: (
    context: import("@microsoft/fast-foundation").ElementDefinitionContext,
    definition: CheckboxOptions
) => import("@microsoft/fast-element").ElementStyles;
/**
 * Base class for Checkbox
 * @public
 */
export { Checkbox };
