import { Slider, SliderOptions } from "@microsoft/fast-foundation";
/**
 * A function that returns a {@link @microsoft/fast-foundation#Slider} registration for configuring the component with a DesignSystem.
 * Implements {@link @microsoft/fast-foundation#sliderTemplate}
 *
 *
 * @public
 * @remarks
 * Generates HTML Element: \<fast-slider\>
 */
export declare const fastSlider: (
    overrideDefinition?: import("@microsoft/fast-foundation").OverrideFoundationElementDefinition<
        SliderOptions
    >
) => import("@microsoft/fast-foundation").FoundationElementRegistry<
    SliderOptions,
    import("@microsoft/fast-element").Constructable<
        import("@microsoft/fast-foundation").FoundationElement
    >
>;
/**
 * Styles for Slider
 * @public
 */
export declare const sliderStyles: (
    context: import("@microsoft/fast-foundation").ElementDefinitionContext,
    definition: SliderOptions
) => import("@microsoft/fast-element").ElementStyles;
/**
 * Base class for Slider
 * @public
 */
export { Slider };
