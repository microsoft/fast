import { Tabs } from "@microsoft/fast-foundation";
/**
 * A function that returns a {@link @microsoft/fast-foundation#Tabs} registration for configuring the component with a DesignSystem.
 * Implements {@link @microsoft/fast-foundation#tabsTemplate}
 *
 *
 * @public
 * @remarks
 * Generates HTML Element: \<fast-tabs\>
 */
export declare const fastTabs: (
    overrideDefinition?: import("@microsoft/fast-foundation").OverrideFoundationElementDefinition<
        import("@microsoft/fast-foundation").FoundationElementDefinition
    >
) => import("@microsoft/fast-foundation").FoundationElementRegistry<
    import("@microsoft/fast-foundation").FoundationElementDefinition,
    typeof Tabs
>;
export * from "../tab";
export * from "../tab-panel";
/**
 * Styles for Tabs
 * @public
 */
export declare const tabsStyles: (
    context: import("@microsoft/fast-foundation").ElementDefinitionContext,
    definition: import("@microsoft/fast-foundation").FoundationElementDefinition
) => import("@microsoft/fast-element").ElementStyles;
/**
 * Base class for Tabs
 * @public
 */
export { Tabs };
