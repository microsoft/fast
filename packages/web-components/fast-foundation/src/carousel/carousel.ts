import { attr, DOM, FASTElement, observable } from "@microsoft/fast-element";
import { KeyCodes } from "@microsoft/fast-web-utilities";

export class Carousel extends FASTElement {
    @attr({ mode: "boolean" })
    public autoplay: boolean = false;

    @attr({ attribute: "autoplay-interval" })
    public autoplayInterval: number = 3000;

    @attr({ mode: "boolean" })
    public loop: boolean = true;

    @attr({ attribute: "aria-describedby" })
    public ariaDescribedby: string;

    @attr({ attribute: "aria-labelledby" })
    public ariaLabelledby: string;

    @attr({ attribute: "aria-label" })
    public ariaLabel: string;

    @attr({ mode: "boolean" })
    public paused: boolean = false;

    @attr({ attribute: "activeid" })
    public activeId: string;

    @observable
    public items: HTMLElement[];

    public carousel: HTMLDivElement;

    public connectedCallback(): void {
        super.connectedCallback();

        //TODO: ADD key handlers, observers???
        this.items = this.items.filter((item: HTMLElement) => item.nodeType === 1);
        console.log("ITEMS:", this.items);
    }

    public disconnectedCallback(): void {
        super.disconnectedCallback();
    }

    public itemsChanged = () => {
        console.log("ITEMS CHANGED");
    };

    public handleTabClick = (e: Event): void => {
        console.log("HIT HANDLE TAB CLICK");
    };
}
