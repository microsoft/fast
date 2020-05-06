import { attr, FASTElement, observable } from "@microsoft/fast-element";

export enum AccordionHeadingLevel {
    h1 = "1",
    h2 = "2",
    h3 = "3",
    h4 = "4",
    h5 = "5",
    h6 = "6",
}

export class AccordionItem extends FASTElement {
    @attr
    public headinglevel: AccordionHeadingLevel = AccordionHeadingLevel.h2;

    @attr({ mode: "boolean" })
    public expanded: boolean = false;

    @attr
    public id: string;

    @observable
    public button: HTMLElement;

    /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
    public clickHandler = (e: MouseEvent) => {
        this.expanded = !this.expanded;
        this.change();
    };

    private change = (): void => {
        this.$emit("change", this.id);
    };
}
