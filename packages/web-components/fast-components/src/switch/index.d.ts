import { Switch, SwitchOptions } from "@microsoft/fast-foundation";
/**
 * A function that returns a {@link @microsoft/fast-foundation#Switch} registration for configuring the component with a DesignSystem.
 * Implements {@link @microsoft/fast-foundation#switchTemplate}
 *
 *
 * @public
 * @remarks
 * Generates HTML Element: \<fast-switch\>
 */
export declare const fastSwitch: (
    overrideDefinition?: import("@microsoft/fast-foundation").OverrideFoundationElementDefinition<
        SwitchOptions
    >
) => import("@microsoft/fast-foundation").FoundationElementRegistry<
    SwitchOptions,
    import("@microsoft/fast-element").Constructable<
        import("@microsoft/fast-foundation").FoundationElement
    >
>;
/**
 * Styles for Switch
 * @public
 */
export declare const switchStyles: (
    context: import("@microsoft/fast-foundation").ElementDefinitionContext,
    definition: SwitchOptions
) => import("@microsoft/fast-element").ElementStyles;
/**
 * Base class for Switch
 * @public
 */
export { Switch };
