import type { ViewTemplate } from "@microsoft/fast-element";
import { children, elements, html, ref, slotted, when } from "@microsoft/fast-element";
import type { FoundationElementTemplate } from "../foundation-element/foundation-element.js";
import { endSlotTemplate, startSlotTemplate } from "../patterns/start-end.js";
import type { TreeItem, TreeItemOptions } from "./tree-item.js";

/**
 * The template for the {@link @microsoft/fast-foundation#(TreeItem:class)} component.
 * @public
 */
export const treeItemTemplate: FoundationElementTemplate<
    ViewTemplate<TreeItem>,
    TreeItemOptions
> = (context, definition) => html`
    <template
        role="treeitem"
        slot="${x => (x.isNestedItem() ? "item" : void 0)}"
        tabindex="-1"
        class="${x =>
            [
                x.expanded && "expanded",
                x.selected && "selected",
                x.nested && "nested",
                x.disabled && "disabled",
            ]
                .filter(Boolean)
                .join(" ")}"
        aria-expanded="${x =>
            x.childItems && x.childItemLength() > 0 ? x.expanded : void 0}"
        aria-selected="${x => x.selected}"
        aria-disabled="${x => x.disabled}"
        @focusin="${(x, c) => x.handleFocus(c.event as FocusEvent)}"
        @focusout="${(x, c) => x.handleBlur(c.event as FocusEvent)}"
        ${children({
            property: "childItems",
            filter: elements(),
        })}
    >
        <div class="positioning-region" part="positioning-region">
            <div class="content-region" part="content-region">
                ${when(
                    x => x.childItems && x.childItemLength(),
                    html<TreeItem>`
                        <div
                            aria-hidden="true"
                            class="expand-collapse-button"
                            part="expand-collapse-button"
                            @click="${(x, c) =>
                                x.handleExpandCollapseButtonClick(c.event as MouseEvent)}"
                            ${ref("expandCollapseButton")}
                        >
                            <slot name="expand-collapse-glyph">
                                ${definition.expandCollapseGlyph || ""}
                            </slot>
                        </div>
                    `
                )}
                ${startSlotTemplate(context, definition)}
                <slot></slot>
                ${endSlotTemplate(context, definition)}
            </div>
        </div>
        ${when(
            x =>
                x.childItems &&
                x.childItemLength() &&
                (x.expanded || x.renderCollapsedChildren),
            html<TreeItem>`
                <div role="group" class="items" part="items">
                    <slot name="item" ${slotted("items")}></slot>
                </div>
            `
        )}
    </template>
`;
