// TODO: ADD animations and classes to previous, current, next slides
// TODO: CHECK for error states, compare with other components
// TODO: ADD more examples to test timer, loop, etc...
// TODO: ADD keyboard controls
// TODO: ADD accessibility features, compare to SPEC and other components

// TODO: ADD check to stop autoplay when carousel is hovered, clicked, or keydowned, anything else???

// TODO: ADD default tabs repeater to TABS class
// TODO: ADD tabs based on repeat directive
// TODO: Sort how to stop tabs adjust from setting

// TODO: Since this is a new component you will have to add the definition to the definitions folder in site-utilities
import { attr, DOM, FASTElement, observable } from "@microsoft/fast-element";
import { KeyCodes, wrapInBounds, limit } from "@microsoft/fast-web-utilities";
import { isNil } from "lodash-es";

export class Carousel extends FASTElement {
    @attr({ mode: "boolean" })
    public autoplay: boolean = true;

    @attr({ attribute: "autoplay-interval" })
    public autoplayInterval: number = 6000;

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
    public activeid: string;

    @attr({ attribute: "slidepicker", mode: "boolean" })
    public slidePicker: boolean = true;

    // TODO: ADD logic to change roles per ARIA spec via tabbed attr, does not change if slide picker is available or not
    @attr({ attribute: "tabbed", mode: "boolean" })
    public tabbed: boolean = true;

    public carousel: HTMLDivElement;

    @observable
    public items: HTMLElement[];
    public itemsChanged(): void {
        this.filteredItems = this.items.filter(
            (item: HTMLElement) => item.nodeType === 1
        );
        this.generateTabPanelIds();
        //TODO: NEED TO FILTER BETTER so that i don't remove text nodes that may actually be content
        //  - text nodes are not stylable though...
        // .map((item: HTMLElement) => {
        //     item.setAttribute("slot", "tabpanel");
        //     return item;
        // });
        console.log("filteredItems: ", this.filteredItems, this.tabPanelIds);
    }

    @observable
    public filteredItems: HTMLElement[];

    // @observable
    // public tabs: HTMLElement[];
    // public tabsChanged(): void {
    //     this.tabs.forEach((tab: HTMLElement, index: number) => {
    //         tab.addEventListener("click", this.handleTabClick(index));
    //         tab.setAttribute("role", "tab");
    //         if (this.activeTabIndex === index) {
    //             tab.setAttribute("aria-selected", "true");
    //         } else {
    //             tab.setAttribute("aria-selected", "false");
    //         }
    //         //TODO: ADD class for when activeIndex matches this tab index so the tab is highlighted properly.
    //     });
    // }

    public handleFlipperClick(direction: 1 | -1, e: Event): void {
        this.incrementSlide(direction);
    }

    private tabPanelIds: string[] = [];
    private activeIndex: number = 0;

    private incrementSlide = (direction: 1 | -1): void => {
        this.activeIndex = wrapInBounds(
            0,
            this.tabPanelIds.length - 1,
            this.activeIndex + direction
        );
        this.activeid = this.tabPanelIds[this.activeIndex];
    };

    private autoplayNextItem = (): void => {
        console.log("HIT AUTO PLAY NEXT ITEM");
        this.incrementSlide(1);
    };

    private generateTabPanelIds(): void {
        this.tabPanelIds = [];
        for (let i = 0; i < this.filteredItems.length; i++) {
            this.tabPanelIds.push(`tab-${i + 1}`);
        }
    }

    // constructor() {
    // super();

    // if (this.autoplay) {
    //     this.autoplayTimer = window.setInterval(
    //         this.autoplayNextItem,
    //         this.autoplayInterval
    //     );
    // }
    // }

    public connectedCallback(): void {
        super.connectedCallback();
        if (this.autoplay) {
            this.autoplayTimer = window.setInterval(
                this.autoplayNextItem,
                this.autoplayInterval
            );
        }
    }

    public disconnectedCallback(): void {
        super.disconnectedCallback();
        if (!isNil(this.autoplayTimer)) {
            this.autoplayTimer = window.clearInterval(this.autoplayTimer as number);
        }
    }

    private autoplayTimer: number | void;
}
