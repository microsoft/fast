import { RadioGroup } from "@microsoft/fast-foundation";
/**
 * A function that returns a {@link @microsoft/fast-foundation#RadioGroup} registration for configuring the component with a DesignSystem.
 * Implements {@link @microsoft/fast-foundation#radioGroupTemplate}
 *
 *
 * @public
 * @remarks
 * Generates HTML Element: \<fast-radio-group\>
 */
export declare const fastRadioGroup: (
    overrideDefinition?: import("@microsoft/fast-foundation").OverrideFoundationElementDefinition<
        import("@microsoft/fast-foundation").FoundationElementDefinition
    >
) => import("@microsoft/fast-foundation").FoundationElementRegistry<
    import("@microsoft/fast-foundation").FoundationElementDefinition,
    typeof RadioGroup
>;
/**
 * Styles for RadioGroup
 * @public
 */
export declare const radioGroupStyles: (
    context: import("@microsoft/fast-foundation").ElementDefinitionContext,
    definition: import("@microsoft/fast-foundation").FoundationElementDefinition
) => import("@microsoft/fast-element").ElementStyles;
/**
 * Base class for RadioGroup
 * @public
 */
export { RadioGroup };
