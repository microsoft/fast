import { Radio, RadioOptions } from "@microsoft/fast-foundation";
/**
 * A function that returns a {@link @microsoft/fast-foundation#Radio} registration for configuring the component with a DesignSystem.
 * Implements {@link @microsoft/fast-foundation#radioTemplate}
 *
 *
 * @public
 * @remarks
 * Generates HTML Element: \<fast-radio\>
 */
export declare const fastRadio: (
    overrideDefinition?: import("@microsoft/fast-foundation").OverrideFoundationElementDefinition<
        RadioOptions
    >
) => import("@microsoft/fast-foundation").FoundationElementRegistry<
    RadioOptions,
    import("@microsoft/fast-element").Constructable<
        import("@microsoft/fast-foundation").FoundationElement
    >
>;
/**
 * Styles for Radio
 * @public
 */
export declare const radioStyles: (
    context: import("@microsoft/fast-foundation").ElementDefinitionContext,
    definition: RadioOptions
) => import("@microsoft/fast-element").ElementStyles;
/**
 * Base class for Radio
 * @public
 */
export { Radio };
