import { html, ref } from "@microsoft/fast-element";
import type { ViewTemplate } from "@microsoft/fast-element";
import type { ElementDefinitionContext } from "../design-system";
import type { FoundationElementDefinition } from "../foundation-element";
import type { VirtualizingStack } from "./virtualizing-stack";

/**
 * The template for the {@link @microsoft/fast-foundation#VirtualizingPanel} component.
 * @public
 */
export const virtualizingStackTemplate: (
    context: ElementDefinitionContext,
    definition: FoundationElementDefinition
) => ViewTemplate<VirtualizingStack> = (
    context: ElementDefinitionContext,
    definition: FoundationElementDefinition
) => html`
    <template
        style="
            height: ${x => x.totalHeight}px
        "
    >
        <div class="top-spacer" style="height: ${x => x.topSpacerHeight}px"></div>
        <slot></slot>
        <div class="bottom-spacer" style="height: ${x => x.bottomSpacerHeight}px"></div>
    </template>
`;
