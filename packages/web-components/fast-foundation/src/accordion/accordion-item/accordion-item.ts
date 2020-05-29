import {
    attr,
    FASTElement,
    nullableNumberConverter,
    observable,
} from "@microsoft/fast-element";
import { StartEnd } from "../../patterns/start-end";
import { applyMixins } from "../../utilities/apply-mixins";

export class AccordionItem extends FASTElement {
    @attr({
        attribute: "heading-level",
        mode: "fromView",
        converter: nullableNumberConverter,
    })
    public headinglevel: 1 | 2 | 3 | 4 | 5 | 6 = 2;

    @attr({ mode: "boolean" })
    public expanded: boolean = false;

    @attr
    public id: string;

    public expandbutton: HTMLElement;

    /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
    public clickHandler = (e: MouseEvent) => {
        this.expanded = !this.expanded;
        this.change();
    };

    private change = (): void => {
        this.$emit("change");
    };
}

/* eslint-disable-next-line */
export interface AccordionItem extends StartEnd {}
applyMixins(AccordionItem, StartEnd);
