import { elements, ElementViewTemplate } from "@microsoft/fast-element";
import { children, html, ref, slotted, when } from "@microsoft/fast-element";
import { endSlotTemplate, startSlotTemplate } from "../patterns/start-end.js";
import type { FASTTreeItem, TreeItemOptions } from "./tree-item.js";

const expandCollapseIcon = `<svg width="12" height="12" viewBox="0 0 12 12" xmlns="http://www.w3.org/2000/svg">
    <path d="M4.65 2.15a.5.5 0 0 0 0 .7L7.79 6 4.65 9.15a.5.5 0 1 0 .7.7l3.5-3.5a.5.5 0 0 0 0-.7l-3.5-3.5a.5.5 0 0 0-.7 0Z"/>
</svg>`;

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
            class="${x =>
                [
                    x.expanded && "expanded",
                    x.selected && "selected",
                    x.nested && "nested",
                    x.disabled && "disabled",
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
                filter: elements(),
            })}
        >
            <div class="treeitem" part="treeitem">
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
                            <span
                                class="expand-collapse-icon"
                                part="expand-collapse-icon"
                            >
                                <slot name="expand-collapse-icon">
                                    ${options.expandCollapseIcon ?? expandCollapseIcon}
                                </slot>
                            </span>
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
