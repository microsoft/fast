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
            style="
                overflow: hidden;
                height: ${x => x.totalHeight}px;
                display: grid;
                grid-template-columns: 1fr;
                grid-template-rows: ${x => x.topSpacerHeight}px 1fr ${x =>
                x.bottomSpacerHeight}px;
            "
            ${ref("containerElement")}
        >
            <div
                class="background"
                style="
                grid-column: 1;
                grid-row-start: 1;
                grid-row-end: 4;
            "
            ></div>
            <div
                class="item-stack"
                style="
                    grid-column: 1;
                    grid-row-start: 2;
                "
            >
                <slot></slot>
            </div>
        </div>
    </template>
`;
