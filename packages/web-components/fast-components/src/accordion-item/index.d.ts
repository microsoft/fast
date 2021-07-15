import { AccordionItem, AccordionItemOptions } from "@microsoft/fast-foundation";
/**
 * A function that returns a {@link @microsoft/fast-foundation#AccordionItem} registration for configuring the component with a DesignSystem.
 * Implements {@link @microsoft/fast-foundation#accordionItemTemplate}
 *
 *
 * @public
 * @remarks
 * Generates HTML Element: \<fast-accordion-item\>
 */
export declare const fastAccordionItem: (
    overrideDefinition?: import("@microsoft/fast-foundation").OverrideFoundationElementDefinition<
        AccordionItemOptions
    >
) => import("@microsoft/fast-foundation").FoundationElementRegistry<
    AccordionItemOptions,
    import("@microsoft/fast-element").Constructable<
        import("@microsoft/fast-foundation").FoundationElement
    >
>;
/**
 * Styles for AccordionItem
 * @public
 */
export declare const accordionItemStyles: (
    context: import("@microsoft/fast-foundation").ElementDefinitionContext,
    definition: AccordionItemOptions
) => import("@microsoft/fast-element").ElementStyles;
/**
 * Base class for Accordion item
 * @public
 */
export { AccordionItem };
