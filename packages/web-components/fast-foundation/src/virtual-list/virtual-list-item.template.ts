import { html, ViewTemplate } from "@microsoft/fast-element";
import { Card } from "../card";
import type { FoundationElementTemplate } from "../foundation-element";
import type { VirtualListItem } from "./virtual-list-item";

function createDefaultContentsTemplate(context): ViewTemplate {
    const cardTag = context.tagFor(Card);
    return html`
    <${cardTag}
        style="
            background: red;
        "
    >
        ${x => x.itemData}
    </${cardTag}>
`;
}

/**
 * The template for the {@link @microsoft/fast-foundation#VirtualList} component.
 * @public
 */
export const virtualListItemTemplate: FoundationElementTemplate<ViewTemplate<
    VirtualListItem
>> = (context, definition) => {
    const defaultContentsTemplate: ViewTemplate = createDefaultContentsTemplate(context);
    return html<VirtualListItem>`
        <template :defaultContentsTemplate="${defaultContentsTemplate}">
            <slot></slot>
        </template>
    `;
};
