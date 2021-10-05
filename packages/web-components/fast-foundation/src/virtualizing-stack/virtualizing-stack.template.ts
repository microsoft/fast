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
    <template>
        <div
            style="
                height: ${x => x.totalHeight}px;
                display: grid;
                grid-template-columns: 1fr;
                grid-template-rows: ${x => x.topSpacerHeight}px repeat(${(x, c) =>
                x.visibleItems.length}, ${x => x.itemSpan}px) ${x =>
                x.bottomSpacerHeight}px;
            "
            ${ref("containerElement")}
        >
            <slot></slot>
        </div>
    </template>
`;
