import { ElementViewTemplate, html, ref, slotted } from "@microsoft/fast-element";
import type { FASTTreeView } from "./tree-view.js";

/**
 * The template for the {@link @microsoft/fast-foundation#FASTTreeView} component.
 * @public
 */
export function treeViewTemplate<T extends FASTTreeView>(): ElementViewTemplate<T> {
    return html<T>`
        <template
            role="tree"
            ${ref("treeView")}
            @keydown="${(x, c) => x.handleKeyDown(c.event as KeyboardEvent)}"
            @focusin="${(x, c) => x.handleFocus(c.event as FocusEvent)}"
            @focusout="${(x, c) => x.handleBlur(c.event as FocusEvent)}"
            @click="${(x, c) => x.handleClick(c.event as MouseEvent)}"
            @selected-change="${(x, c) => x.handleSelectedChange(c.event)}"
        >
            <slot ${slotted("slottedTreeItems")}></slot>
        </template>
    `;
}
