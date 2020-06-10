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
    public itemsChanged(): void {
        this.filteredItems = this.items
            .filter((item: HTMLElement) => item.nodeType === 1)
            .map((item: HTMLElement, index: number) => {
                if (index === this.activeTabIndex) {
                    item.classList.add("active");
                }
                item.classList.add("slide");

                return item;
            });

        console.log("ITEMS CHANGED: ", this.items, this.filteredItems);
    }

    @observable
    public filteredItems: HTMLElement[];

    @observable
    public tabs: HTMLElement[];
    public tabsChanged(): void {
        this.tabs.forEach((tab: HTMLElement, index: number) => {
            tab.addEventListener("click", this.handleTabClick(index));
        });
    }

    public carousel: HTMLDivElement;

    // public connectedCallback(): void {
    //     super.connectedCallback();
    // }

    // public disconnectedCallback(): void {
    //     super.disconnectedCallback();
    // }

    public handleTabClick(index: number): (e: Event) => void {
        return (e: Event): void => {
            console.log("HIT HANDLE TAB CLICK, index: ", index);
        };
    }

    private activeTabIndex: number = 0;
}
