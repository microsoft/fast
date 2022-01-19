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
            part="container'
            style="
                width: ${x =>
                    x.orientation === Orientation.vertical
                        ? "100%"
                        : `${x.totalStackSpan}px`};
                height: ${x =>
                    x.orientation !== Orientation.vertical
                        ? "100%"
                        : `${x.totalStackSpan}px`};
                display: grid;
                grid-template-rows: 1fr;
                grid-template-columns: 1fr;
            "
            ${ref("containerElement")}
        >
            <slot></slot>
        </div>
    </template>
`;
