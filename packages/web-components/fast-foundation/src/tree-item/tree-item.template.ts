import type { ElementViewTemplate } from "@microsoft/fast-element";
import { children, elements, html, ref, slotted, when } from "@microsoft/fast-element";
import { endSlotTemplate, startSlotTemplate } from "../patterns/index.js";
import type { FASTTreeItem, TreeItemOptions } from "./tree-item.js";

/**
 * The template for the {@link @microsoft/fast-foundation#(FASTTreeItem:class)} component.
 * @public
 */
export function treeItemTemplate(
    options: TreeItemOptions = {}
): ElementViewTemplate<FASTTreeItem> {
    return html<FASTTreeItem>`
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
                        html<FASTTreeItem>`
                            <div
                                aria-hidden="true"
                                class="expand-collapse-button"
                                part="expand-collapse-button"
                                @click="${(x, c) =>
                                    x.handleExpandCollapseButtonClick(
                                        c.event as MouseEvent
                                    )}"
                                ${ref("expandCollapseButton")}
                            >
                                <slot name="expand-collapse-glyph">
                                    ${options.expandCollapseGlyph || ""}
                                </slot>
                            </div>
                        `
                    )}
                    ${startSlotTemplate(options)}
                    <slot></slot>
                    ${endSlotTemplate(options)}
                </div>
            </div>
            ${when(
                x =>
                    x.childItems &&
                    x.childItemLength() &&
                    (x.expanded || x.renderCollapsedChildren),
                html<FASTTreeItem>`
                    <div role="group" class="items" part="items">
                        <slot name="item" ${slotted("items")}></slot>
                    </div>
                `
            )}
        </template>
    `;
}
