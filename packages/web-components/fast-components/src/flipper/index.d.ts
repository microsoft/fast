import { Flipper, FlipperOptions } from "@microsoft/fast-foundation";
/**
 * A function that returns a {@link @microsoft/fast-foundation#Flipper} registration for configuring the component with a DesignSystem.
 * Implements {@link @microsoft/fast-foundation#flipperTemplate}
 *
 *
 * @public
 * @remarks
 * Generates HTML Element: \<fast-flipper\>
 */
export declare const fastFlipper: (
    overrideDefinition?: import("@microsoft/fast-foundation").OverrideFoundationElementDefinition<
        FlipperOptions
    >
) => import("@microsoft/fast-foundation").FoundationElementRegistry<
    FlipperOptions,
    import("@microsoft/fast-element").Constructable<
        import("@microsoft/fast-foundation").FoundationElement
    >
>;
/**
 * Styles for Flipper
 * @public
 */
export declare const flipperStyles: (
    context: import("@microsoft/fast-foundation").ElementDefinitionContext,
    definition: FlipperOptions
) => import("@microsoft/fast-element").ElementStyles;
/**
 * Base class for Flipper
 * @public
 */
export { Flipper };
