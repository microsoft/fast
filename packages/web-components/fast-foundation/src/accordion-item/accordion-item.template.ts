import { ElementViewTemplate, html, ref } from "@microsoft/fast-element";
import { endSlotTemplate, startSlotTemplate } from "../patterns/index.js";
import type { AccordionItemOptions, FASTAccordionItem } from "./accordion-item.js";

/**
 * The template for the {@link @microsoft/fast-foundation#(FASTAccordionItem:class)} component.
 * @public
 */
export function accordionItemTemplate(
    options: AccordionItemOptions = {}
): ElementViewTemplate<FASTAccordionItem> {
    return html<FASTAccordionItem>`
        <template class="${x => (x.expanded ? "expanded" : "")}">
            <div
                class="heading"
                part="heading"
                role="heading"
                aria-level="${x => x.headinglevel}"
            >
                <button
                    class="button"
                    part="button"
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
                ${startSlotTemplate(options)}
                ${endSlotTemplate(options)}
                <span class="icon" part="icon" aria-hidden="true">
                    <slot name="expanded-icon">
                        ${options.expandedIcon || ""}
                    </slot>
                    <slot name="collapsed-icon">
                        ${options.collapsedIcon || ""}
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
