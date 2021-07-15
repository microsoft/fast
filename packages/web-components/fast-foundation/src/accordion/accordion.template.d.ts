import type { ViewTemplate } from "@microsoft/fast-element";
import type { Accordion } from "./accordion";
import type { ElementDefinitionContext } from "../design-system";
import type { FoundationElementDefinition } from "../foundation-element";
/**
 * The template for the {@link @microsoft/fast-foundation#Accordion} component.
 * @public
 */
export declare const accordionTemplate: (
    context: ElementDefinitionContext,
    definition: FoundationElementDefinition
) => ViewTemplate<Accordion>;
