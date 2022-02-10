import { html, ref, ViewTemplate } from "@microsoft/fast-element";
import { Orientation } from "@microsoft/fast-web-utilities";
import type { FoundationElementTemplate } from "../foundation-element";
import type { VirtualList } from "./virtual-list";
/**
 * The template for the {@link @microsoft/fast-foundation#VirtualList} component.
 * @public
 */
export const virtualListTemplate: FoundationElementTemplate<ViewTemplate<VirtualList>> = (
    context,
    definition
) => html`
    <template>
        <div
            class="container"
            part="container"
            style="
                width: ${x =>
                x.orientation === Orientation.vertical ? "100%" : `${x.totalListSpan}px`};
                height: ${x =>
                x.orientation !== Orientation.vertical ? "100%" : `${x.totalListSpan}px`};
            "
            ${ref("containerElement")}
        >
            <slot></slot>
        </div>
    </template>
`;
