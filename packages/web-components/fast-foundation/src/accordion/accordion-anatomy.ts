import { elements, slotted, ViewTemplate } from "@microsoft/fast-element";
import { Anatomy, AnatomyValidator } from "../builder/anatomy.js";
import { build } from "../builder/template-builder.js";
import type { Accordion } from "./accordion.js";

export class AccordionAnatomy extends Anatomy<Accordion> {
    private hasDefaultSlot = false;

    defaultSlot(): this {
        this.hasDefaultSlot = true;
        this.internals.slot(slotted({ property: "accordionItems", filter: elements() }));
        return this;
    }

    protected validateCallback(validator: AnatomyValidator): void {
        validator.assert(
            this.hasDefaultSlot,
            "A default slot is required in order to place items inside of an accordion."
        );
    }
}

export function foundationAccordionTemplate(): ViewTemplate<Accordion> {
    return build(AccordionAnatomy)
        .anatomy(x => x.defaultSlot())
        .build();
}

// example
const customTemplate = build(AccordionAnatomy)
    .anatomy(x => {
        x.html`before default slot ${x => x.accordionItems}`.defaultSlot()
            .html`after default slot`;
    })
    .build();
