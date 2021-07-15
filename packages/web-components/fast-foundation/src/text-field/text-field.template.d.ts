import type { ViewTemplate } from "@microsoft/fast-element";
import type { TextField } from "./text-field";
import type { FoundationElementDefinition } from "../foundation-element";
import type { ElementDefinitionContext } from "../design-system";
/**
 * The template for the {@link @microsoft/fast-foundation#(TextField:class)} component.
 * @public
 */
export declare const textFieldTemplate: (
    context: ElementDefinitionContext,
    definition: FoundationElementDefinition
) => ViewTemplate<TextField>;
