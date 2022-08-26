import type { ElementViewTemplate } from "@microsoft/fast-element";
import { children, html, ref, slotted, when } from "@microsoft/fast-element";
import { endSlotTemplate, startSlotTemplate } from "../patterns/start-end.js";
import type { FASTTreeItem, TreeItemOptions } from "./tree-item.js";
import { isTreeItemElement } from "./tree-item.js";

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
                    x.disabled && "disabled",
                    x.expanded && "expanded",
                    x.nested && "nested",
                    x.selected && "selected",
                ]
                    .filter(Boolean)
                    .join(" ")}"
            aria-expanded="${x => x.ariaExpanded}"
            aria-selected="${x => x.ariaSelected}"
            aria-disabled="${x => x.ariaDisabled}"
            @focusin="${(x, c) => x.handleFocus(c.event as FocusEvent)}"
            @focusout="${(x, c) => x.handleBlur(c.event as FocusEvent)}"
            ${children({
                property: "childItems",
                filter: isTreeItemElement,
            })}
        >
            <div class="positioning-region" part="positioning-region">
                <div class="content-region" part="content-region">
                    ${when(
                        x => x.childItems.length,
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
                                    ${options.expandCollapseGlyph ?? ""}
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
                x => x.childItems.length && x.expanded,
                html<FASTTreeItem>`
                    <div role="group" class="items" part="items">
                        <slot name="item" ${slotted("items")}></slot>
                    </div>
                `
            )}
        </template>
    `;
}
