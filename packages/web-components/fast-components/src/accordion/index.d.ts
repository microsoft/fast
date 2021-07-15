import { Accordion } from "@microsoft/fast-foundation";
export * from "../accordion-item/index";
/**
 * A function that returns a {@link @microsoft/fast-foundation#Accordion} registration for configuring the component with a DesignSystem.
 * Implements {@link @microsoft/fast-foundation#accordionTemplate}
 *
 *
 * @public
 * @remarks
 * Generates the HTML Element: \<fast-accordion\>
 */
export declare const fastAccordion: (
    overrideDefinition?: import("@microsoft/fast-foundation").OverrideFoundationElementDefinition<
        import("@microsoft/fast-foundation").FoundationElementDefinition
    >
) => import("@microsoft/fast-foundation").FoundationElementRegistry<
    import("@microsoft/fast-foundation").FoundationElementDefinition,
    typeof Accordion
>;
/**
 * Styles for Accordion
 * @public
 */
export declare const accordionStyles: (
    context: import("@microsoft/fast-foundation").ElementDefinitionContext,
    definition: import("@microsoft/fast-foundation").FoundationElementDefinition
) => import("@microsoft/fast-element").ElementStyles;
/**
 * Base class for Accordion
 * @public
 */
export { Accordion };
