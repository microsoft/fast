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
            class="container"
            style="height: ${x => x.totalHeight}px"
            ${ref("container")}
        >
            <div class="top-spacer" style="height: ${x => x.topSpacerHeight}px"></div>
            <div class="item-stack" style="height: ${x => x.itemStackHeight}px">
                <slot></slot>
            </div>
            <div
                class="bottom-spacer"
                style="height: ${x => x.bottomSpacerHeight}px"
            ></div>
        </div>
    </template>
`;
