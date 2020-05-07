import { attr, booleanConverter, FASTElement, observable } from "@microsoft/fast-element";

export class AccordionItem extends FASTElement {
    @attr({ attribute: "heading-level", mode: "fromView", converter: booleanConverter })
    public headinglevel: 1 | 2 | 3 | 4 | 5 | 6 = 2;

    @attr({ mode: "boolean" })
    public expanded: boolean = false;

    @attr
    public id: string;

    @observable
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
