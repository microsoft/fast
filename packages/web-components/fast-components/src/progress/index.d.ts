import { BaseProgress as Progress, ProgressOptions } from "@microsoft/fast-foundation";
/**
 * A function that returns a {@link @microsoft/fast-foundation#BaseProgress} registration for configuring the component with a DesignSystem.
 * Implements {@link @microsoft/fast-foundation#progressTemplate}
 *
 *
 * @public
 * @remarks
 * Generates HTML Element: \<fast-progress\>
 */
export declare const fastProgress: (
    overrideDefinition?: import("@microsoft/fast-foundation").OverrideFoundationElementDefinition<
        ProgressOptions
    >
) => import("@microsoft/fast-foundation").FoundationElementRegistry<
    ProgressOptions,
    import("@microsoft/fast-element").Constructable<
        import("@microsoft/fast-foundation").FoundationElement
    >
>;
/**
 * Styles for Progress
 * @public
 */
export declare const progressStyles: (
    context: import("@microsoft/fast-foundation").ElementDefinitionContext,
    definition: ProgressOptions
) => import("@microsoft/fast-element").ElementStyles;
/**
 * Base class for Progress
 * @public
 */
export { Progress };
