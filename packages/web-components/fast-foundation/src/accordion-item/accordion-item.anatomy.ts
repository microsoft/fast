import { ref } from "@microsoft/fast-element";
import { Anatomy, SlotOptions } from "../builder/anatomy.js";
import type { AccordionItem } from "./accordion-item.js";

type AccordionItemParts =
    | "region"
    | "heading"
    | "button"
    | "heading-content"
    | "start"
    | "end"
    | "icon"
    | "expanded-icon"
    | "collapsed-icon";

export class AccordionItemAnatomy extends Anatomy<AccordionItem, AccordionItemParts> {
    protected begin() {
        this.html`<template class="${x => (x.expanded ? "expanded" : "")}">`;
    }

    heading(callback: (a: AccordionItemHeadingAnatomy) => void) {
        this.internals.anatomy(AccordionItemHeadingAnatomy, callback);
        return this;
    }

    defaultSlot() {
        const { part } = this.internals;
        return this.html`
            <div
                class="region"
                ${part("region")}
                id="${x => x.id}-panel"
                role="region"
                aria-labelledby="${x => x.id}"
            >
                <slot></slot>
            </div>
        `;
    }

    protected end(): void {
        this.html`</template>`;
    }
}

class AccordionItemHeadingAnatomy extends Anatomy<AccordionItem, AccordionItemParts> {
    protected begin(): void {
        const { part } = this.internals;
        this.html`
            <div class="heading"
                ${part("heading")}
                role="heading"
                aria-level="${x => x.headinglevel}"
            >
        `;
    }

    button(options?: Partial<SlotOptions>) {
        const { part, slot } = this.internals;
        return this.html`
            <button
                class="button"
                ${part("button")}
                ${ref("expandbutton")}
                aria-expanded="${x => x.expanded}"
                aria-controls="${x => x.id}-panel"
                id="${x => x.id}"
                @click="${(x, c) => x.clickHandler(c.event as MouseEvent)}"
                >
                <span class="heading-content" ${part("heading-content")}>
                    ${slot(Object.assign({ name: "button", fallback: "" }, options))}
                </span>
            </button>
        `;
    }

    startSlot(options?: Partial<SlotOptions>) {
        const { slot } = this.internals;
        return this.html`${slot(
            Object.assign({ name: "start" }, options),
            ref("start")
        )}`;
    }

    endSlot(options?: Partial<SlotOptions>) {
        const { slot } = this.internals;
        return this.html`${slot(Object.assign({ name: "end" }, options), ref("end"))}`;
    }

    icons(callback: (a: AccordionIconAnatomy) => void) {
        this.internals.anatomy(AccordionIconAnatomy, callback);
        return this;
    }

    protected end(): void {
        this.html`</div>`;
    }
}

class AccordionIconAnatomy extends Anatomy<AccordionItem, AccordionItemParts> {
    protected begin(): void {
        const { part } = this.internals;
        this.html`<span class="icon" ${part("icon")} aria-hidden="true">`;
    }

    expanded(options?: Partial<SlotOptions>) {
        const { part, slot } = this.internals;
        return this.html`${slot(
            Object.assign({ name: "expanded-icon" }, options),
            part("expanded-icon")
        )}`;
    }

    collapsed(options?: Partial<SlotOptions>) {
        const { part, slot } = this.internals;
        return this.html`${slot(
            Object.assign({ name: "collapsed-icon" }, options),
            part("collapsed-icon")
        )}`;
    }

    protected end(): void {
        this.html`</span>`;
    }
}

// default
export function foundationAccordionItemTemplate() {
    return AccordionItemAnatomy.define()
        .anatomy(item =>
            item.heading(heading =>
                heading
                    .button()
                    .startSlot()
                    .endSlot()
                    .icons(icons =>
                        icons
                            .expanded({ fallback: "icon..." })
                            .collapsed({ fallback: "icon..." })
                    )
            )
        )
        .build();
}

// custom
const customTemplate = AccordionItemAnatomy.define()
    .parts({
        button: "control",
        region: "content",
    })
    .anatomy(item =>
        item
            .heading(
                heading =>
                    heading.html`first`.button().startSlot({ name: "prefix" }).html`last`
            )
            .defaultSlot()
    )
    .build();
