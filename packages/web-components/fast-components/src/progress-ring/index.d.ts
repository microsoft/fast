import {
    BaseProgress as ProgressRing,
    ProgressRingOptions,
} from "@microsoft/fast-foundation";
/**
 * A function that returns a {@link @microsoft/fast-foundation#BaseProgress} registration for configuring the component with a DesignSystem.
 * Implements {@link @microsoft/fast-foundation#progressRingTemplate}
 *
 *
 * @public
 * @remarks
 * Generates HTML Element: \<fast-progress-ring\>
 */
export declare const fastProgressRing: (
    overrideDefinition?: import("@microsoft/fast-foundation").OverrideFoundationElementDefinition<
        ProgressRingOptions
    >
) => import("@microsoft/fast-foundation").FoundationElementRegistry<
    ProgressRingOptions,
    import("@microsoft/fast-element").Constructable<
        import("@microsoft/fast-foundation").FoundationElement
    >
>;
/**
 * Styles for ProgressRing
 * @public
 */
export declare const progressRingStyles: (
    context: import("@microsoft/fast-foundation").ElementDefinitionContext,
    definition: ProgressRingOptions
) => import("@microsoft/fast-element").ElementStyles;
/**
 * Base class for ProgressRing
 * @public
 */
export { ProgressRing };
