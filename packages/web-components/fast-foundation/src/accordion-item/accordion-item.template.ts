import { ElementViewTemplate, html, ref } from "@microsoft/fast-element";
import { endSlotTemplate, startSlotTemplate } from "../patterns/index.js";
import type { AccordionItemOptions, FASTAccordionItem } from "./accordion-item.js";

const expandedIcon = `<svg width="12" height="12" viewBox="0 0 12 12" xmlns="http://www.w3.org/2000/svg"><path d="M2.15 7.35c.2.2.5.2.7 0L6 4.21l3.15 3.14a.5.5 0 1 0 .7-.7l-3.5-3.5a.5.5 0 0 0-.7 0l-3.5 3.5a.5.5 0 0 0 0 .7Z"/></svg>`;

const collapsedIcon = `<svg width="12" height="12" viewBox="0 0 12 12" xmlns="http://www.w3.org/2000/svg"><path d="M2.15 4.65c.2-.2.5-.2.7 0L6 7.79l3.15-3.14a.5.5 0 1 1 .7.7l-3.5 3.5a.5.5 0 0 1-.7 0l-3.5-3.5a.5.5 0 0 1 0-.7Z"/></svg>`;

/**
 * The template for the {@link @microsoft/fast-foundation#(FASTAccordionItem:class)} component.
 * @public
 */
export function accordionItemTemplate<T extends FASTAccordionItem>(
    options: AccordionItemOptions = {}
): ElementViewTemplate<T> {
    return html<T>`
        <template class="${x => (x.expanded ? "expanded" : "")}">
            <div
                class="heading"
                part="heading"
                role="heading"
                aria-level="${x => x.headinglevel}"
            >
                ${startSlotTemplate(options)}
                <button
                    class="control"
                    part="control"
                    ${ref("expandbutton")}
                    aria-expanded="${x => x.expanded}"
                    aria-controls="${x => x.id}-panel"
                    id="${x => x.id}"
                    @click="${(x, c) => x.clickHandler(c.event as MouseEvent)}"
                >
                    <span class="heading-content" part="heading-content">
                        <slot name="heading"></slot>
                    </span>
                </button>
                ${endSlotTemplate(options)}
                <span class="expand-collapse-icon" part="expand-collapse-icon" aria-hidden="true">
                    <slot name="expanded-icon">
                        ${options.expandedIcon ?? ""}
                    </slot>
                    <slot name="collapsed-icon">
                        ${options.collapsedIcon ?? ""}
                    </slot>
                <span>
            </div>
            <div
                class="region"
                part="region"
                id="${x => x.id}-panel"
                role="region"
                aria-labelledby="${x => x.id}"
            >
                <slot></slot>
            </div>
        </template>
`;
}
