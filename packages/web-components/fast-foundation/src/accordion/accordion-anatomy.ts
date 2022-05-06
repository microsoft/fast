import { elements, slotted, ViewTemplate } from "@microsoft/fast-element";
import { Anatomy, AnatomyValidator } from "../builder/anatomy.js";
import type { Accordion } from "./accordion.js";

export class AccordionAnatomy extends Anatomy<Accordion> {
    private hasDefaultSlot = false;

    defaultSlot(): this {
        const { slot } = this.internals;
        this.hasDefaultSlot = true;
        return this.html`${slot(
            slotted({ property: "accordionItems", filter: elements() })
        )}`;
    }

    protected end(validator: AnatomyValidator): void {
        validator.assert(
            this.hasDefaultSlot,
            "A default slot is required in order to place items inside of an accordion."
        );
    }
}

// default
export function foundationAccordionTemplate(): ViewTemplate<Accordion> {
    return AccordionAnatomy.define()
        .anatomy(x => x.defaultSlot())
        .build();
}

// custom
const customTemplate = AccordionAnatomy.define()
    .anatomy(accordion => {
        accordion.html`before default slot ${x => x.accordionItems}`.defaultSlot()
            .html`after default slot`;
    })
    .build();
