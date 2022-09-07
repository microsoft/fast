import { elements, ElementViewTemplate } from "@microsoft/fast-element";
import { children, html, ref, slotted, when } from "@microsoft/fast-element";
import { endSlotTemplate, startSlotTemplate } from "../patterns/start-end.js";
import type { FASTTreeItem, TreeItemOptions } from "./tree-item.js";

/**
 * The template for the {@link @microsoft/fast-foundation#(FASTTreeItem:class)} component.
 * @public
 */
export function treeItemTemplate<T extends FASTTreeItem>(
    options: TreeItemOptions = {}
): ElementViewTemplate<T> {
    return html<T>`
        <template
            role="treeitem"
            slot="${x => (x.isNestedItem() ? "item" : void 0)}"
            tabindex="-1"
            class="${x => [x.nested && "nested"].filter(Boolean).join(" ")}"
            aria-expanded="${x => x.ariaExpanded}"
            aria-selected="${x => x.ariaSelected}"
            aria-disabled="${x => x.ariaDisabled}"
            @focusin="${(x, c) => x.handleFocus(c.event as FocusEvent)}"
            @focusout="${(x, c) => x.handleBlur(c.event as FocusEvent)}"
            ${children({
                property: "childItems",
                filter: elements(),
            })}
        >
            <div class="control" part="control">
                ${when(
                    x => x.childItems && x.childItemLength(),
                    html<T>`
                        <div
                            aria-hidden="true"
                            class="expand-collapse-button"
                            part="expand-collapse-button"
                            @click="${(x, c) =>
                                x.handleExpandCollapseButtonClick(c.event as MouseEvent)}"
                            ${ref("expandCollapseButton")}
                        >
                            <slot name="expand-collapse-icon">
                                ${options.expandCollapseIcon ?? ""}
                            </slot>
                        </div>
                    `
                )}
                ${startSlotTemplate(options)}
                <span class="content" part="content">
                    <slot></slot>
                </span>
                ${endSlotTemplate(options)}
            </div>
            ${when(
                x => x.childItems && x.childItemLength() && x.expanded,
                html<T>`
                    <div role="group" class="items" part="items">
                        <slot name="item" ${slotted("items")}></slot>
                    </div>
                `
            )}
        </template>
    `;
}
