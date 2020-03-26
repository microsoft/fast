import { attr, DOM, FastElement, observable } from "@microsoft/fast-element";
import { keyCodeEscape, keyCodeTab } from "@microsoft/fast-web-utilities";

export class Carousel extends FastElement {
    @attr
    public autoplay: boolean = false;

    private autoplayChanged(): void {
        console.log("autoplay changed!")
    }

    @attr
    public autoplayInterval: number = 6000;

    private autoplayIntervalChanged(): void {
        console.log("autoplayInterval changed!")
    }

    @attr
    public loop: boolean = true;
    private loopChanged(): void {
        console.log("loop changed!")
    }

    @attr({ attribute: "aria-labelledby" })
    public ariaLabelledby: string;

    @attr({ attribute: "aria-label" })
    public ariaLabel: string;

    /**
     * The paused state of the control
     */
    // @attr({ mode: "boolean" })
    @observable
    public paused: boolean = false;
    private pausedChanged(): void {
        console.log("paused changed!")
    }

    public carousel: HTMLDivElement;

    public items: NodeListOf<Element> | undefined;

    constructor() {
        super();
        this.items = this.getItems();
    }

    public connectedCallback(): void {
        super.connectedCallback();
        this.setItems();
    }

    private getItems():  NodeListOf<Element> | undefined {
        return this.shadowRoot?.querySelectorAll('slot:not([name])');
    }

    private setItems(): void {
        const itemsContainer = this.shadowRoot?.querySelector('.carousel-items');
        itemsContainer!.innerHTML = '';

        [].forEach.call(this.items, ((item: Node): void => {
            itemsContainer?.appendChild(item);
        }))
    }

    public handleClick = (e: Event): void => {
        // TODO: ADD click handler for each controller
    }
}
