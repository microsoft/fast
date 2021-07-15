import { SliderLabel as FoundationSliderLabel } from "@microsoft/fast-foundation";
/**
 * @internal
 */
export declare class SliderLabel extends FoundationSliderLabel {
    protected sliderOrientationChanged(): void;
}
/**
 * A function that returns a {@link @microsoft/fast-foundation#SliderLabel} registration for configuring the component with a DesignSystem.
 * Implements {@link @microsoft/fast-foundation#sliderLabelTemplate}
 *
 *
 * @public
 * @remarks
 * Generates HTML Element: \<fast-slider-label\>
 */
export declare const fastSliderLabel: (
    overrideDefinition?: import("@microsoft/fast-foundation").OverrideFoundationElementDefinition<
        import("@microsoft/fast-foundation").FoundationElementDefinition
    >
) => import("@microsoft/fast-foundation").FoundationElementRegistry<
    import("@microsoft/fast-foundation").FoundationElementDefinition,
    typeof SliderLabel
>;
/**
 * Styles for SliderLabel
 * @public
 */
export declare const sliderLabelStyles: (
    context: import("@microsoft/fast-foundation").ElementDefinitionContext,
    definition: import("@microsoft/fast-foundation").FoundationElementDefinition
) => import("@microsoft/fast-element").ElementStyles;
