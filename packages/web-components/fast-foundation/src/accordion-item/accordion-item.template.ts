import { html, ref } from "@microsoft/fast-element";
import type { ViewTemplate } from "@microsoft/fast-element";
import { endSlotTemplate, startSlotTemplate } from "../patterns/start-end.js";
import type { FoundationElementTemplate } from "../foundation-element/foundation-element.js";
import type { AccordionItem, AccordionItemOptions } from "./accordion-item.js";

/**
 * The template for the {@link @microsoft/fast-foundation#(AccordionItem:class)} component.
 * @public
 */
export const accordionItemTemplate: FoundationElementTemplate<
    ViewTemplate<AccordionItem>,
    AccordionItemOptions
> = (context, definition) => html`
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
            ${startSlotTemplate(context, definition)}
            ${endSlotTemplate(context, definition)}
            <span class="icon" part="icon" aria-hidden="true">
                <slot name="expanded-icon" part="expanded-icon">
                    ${definition.expandedIcon || ""}
                </slot>
                <slot name="collapsed-icon" part="collapsed-icon">
                    ${definition.collapsedIcon || ""}
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
