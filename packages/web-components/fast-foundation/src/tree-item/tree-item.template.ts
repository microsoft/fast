import { children, elements, html, ref, slotted, when } from "@microsoft/fast-element";
import type { ViewTemplate } from "@microsoft/fast-element";
import { endSlotTemplate, startSlotTemplate } from "../patterns/start-end";
import type { ElementDefinitionContext } from "../design-system";
import type { TreeItem, TreeItemOptions } from "./tree-item";

/**
 * The template for the {@link @microsoft/fast-foundation#(TreeItem:class)} component.
 * @public
 */
export const treeItemTemplate: (
    context: ElementDefinitionContext,
    definition: TreeItemOptions
) => ViewTemplate<TreeItem> = (
    context: ElementDefinitionContext,
    definition: TreeItemOptions
) => html`
    <template
        role="treeitem"
        slot="${x => (x.isNestedItem() ? "item" : void 0)}"
        tabindex="${x => (x.disabled || !x.focusable ? void 0 : 0)}"
        class="${x => (x.expanded ? "expanded" : "")} ${x =>
            x.selected ? "selected" : ""} ${x => (x.nested ? "nested" : "")}
            ${x => (x.disabled ? "disabled" : "")}"
        aria-expanded="${x =>
            x.childItems && x.childItemLength() > 0 ? x.expanded : void 0}"
        aria-selected="${x => x.selected}"
        aria-disabled="${x => x.disabled}"
        @keydown="${(x, c) => x.handleKeyDown(c.event as KeyboardEvent)}"
        @click="${(x, c) => x.handleClick(c.event as MouseEvent)}"
        ${children({
            property: "childItems",
            filter: elements(),
        })}
    >
        <div class="positioning-region" part="positioning-region">
            <div class="content-region" part="content-region">
                ${when(
                    x => x.childItems && x.childItemLength() > 0,
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
                x.childItemLength() > 0 &&
                (x.expanded || x.renderCollapsedChildren),
            html<TreeItem>`
                <div role="group" class="items" part="items">
                    <slot name="item" ${slotted("items")}></slot>
                </div>
            `
        )}
    </template>
`;
