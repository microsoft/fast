import { html, ref } from "@microsoft/fast-element";
import { Accordion, AccordionExpandMode } from "../accordion/accordion";
import { endTemplate, startTemplate } from "../patterns/start-end";
import { AccordionItem } from "./accordion-item";

/**
 * The template for the {@link @microsoft/fast-foundation#(AccordionItem:class)} component.
 * @public
 */
export const AccordionItemTemplate = html<AccordionItem>`
    <template
        class="${x => (x.expanded ? "expanded" : "")}"
        slot="item"
    >
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
                aria-disabled="${x => (x.ariaDisabled ? true : void 0)}"
                aria-controls="${x => x.id}-panel"
                id="${x => x.id}"
                @click="${(x, c) => x.clickHandler(c.event as MouseEvent)}"
            >
                <span class="heading">
                    <slot name="heading" part="heading"></slot>
                </span>
            </button>
            ${startTemplate}
            ${endTemplate}
            <span class="icon" part="icon">
                <slot name="expanded-icon" part="expanded-icon"></slot>
                <slot name="collapsed-icon" part="collapsed-icon"></slot>
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
