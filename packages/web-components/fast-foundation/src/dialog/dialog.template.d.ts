import type { ViewTemplate } from "@microsoft/fast-element";
import type { Dialog } from "./dialog";
import type { FoundationElementDefinition } from "../foundation-element";
import type { ElementDefinitionContext } from "../design-system";
/**
 * The template for the {@link @microsoft/fast-foundation#Dialog} component.
 * @public
 */
export declare const dialogTemplate: (
    context: ElementDefinitionContext,
    definition: FoundationElementDefinition
) => ViewTemplate<Dialog>;
