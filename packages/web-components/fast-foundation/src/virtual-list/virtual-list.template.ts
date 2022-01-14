import { html, ref } from "@microsoft/fast-element";
import type { ViewTemplate } from "@microsoft/fast-element";
import { Orientation } from "@microsoft/fast-web-utilities";
import type { ElementDefinitionContext } from "../design-system";
import type { FoundationElementDefinition } from "../foundation-element";
import type { VirtualList } from "./virtual-list";

/**
 * The template for the {@link @microsoft/fast-foundation#VirtualList} component.
 * @public
 */
export const virtualListTemplate: (
    context: ElementDefinitionContext,
    definition: FoundationElementDefinition
) => ViewTemplate<VirtualList> = (
    context: ElementDefinitionContext,
    definition: FoundationElementDefinition
) => html`
    <template>
        <div
            class="container"
            style="
                width: ${x =>
                x.orientation !== Orientation.vertical
                    ? `${x.totalStackSpan}px`
                    : "100%"};
                grid-template-columns: ${x =>
                x.orientation !== Orientation.vertical ? x.gridTemplateSpans : "1fr"};
                height: ${x =>
                x.orientation === Orientation.vertical
                    ? `${x.totalStackSpan}px`
                    : "100%"};
                grid-template-rows:${x =>
                x.orientation === Orientation.vertical ? x.gridTemplateSpans : "1fr"};
                display: grid;
            "
            ${ref("containerElement")}
        >
            <slot></slot>
        </div>
    </template>
`;
