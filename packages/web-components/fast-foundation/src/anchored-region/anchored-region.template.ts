import { html, when } from "@microsoft/fast-element";
import type { ViewTemplate } from "@microsoft/fast-element";
import type { ElementDefinitionContext } from "../design-system";
import type {
    FoundationElementDefinition,
    FoundationElementTemplate,
} from "../foundation-element";
import type { AnchoredRegion } from "./anchored-region";

/**
 * The template for the {@link @microsoft/fast-foundation#(AnchoredRegion:class)} component.
 * @beta
 */
export const anchoredRegionTemplate: FoundationElementTemplate<ViewTemplate<
    AnchoredRegion
>> = (context: ElementDefinitionContext, definition: FoundationElementDefinition) => html`
    <template class="${x => (x.initialLayoutComplete ? "loaded" : "")}">
        ${when(
            x => x.initialLayoutComplete,
            html<AnchoredRegion>`
                <slot></slot>
            `
        )}
    </template>
`;
