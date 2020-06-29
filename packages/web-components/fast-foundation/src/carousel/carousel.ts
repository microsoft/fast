// TODO: ADD animations and classes to previous, current, next slides???
// TODO: CHECK for error states, compare with other components
// TODO: ADD more examples to test timer, loop, etc...
// TODO: ADD keyboard controls
// TODO: CHECK tab index of all controls
// TODO: ADD accessibility features, compare to SPEC and other components

// TODO: ADD check to stop autoplay when carousel is hovered, clicked, or keydowned, anything else???
// TODO: Since this is a new component you will have to add the definition to the definitions folder in site-utilities
// TODO: ADD change $emit, for active slide and paused?
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

    @attr({ attribute: "activeId" })
    public activeId: string;

    @attr({ attribute: "slidepicker", mode: "boolean" })
    public slidePicker: boolean = true;

    // TODO: ADD logic to change roles per ARIA spec via tabbed attr (this attr does not change if slide picker is available or not)
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
    }

    @observable
    public filteredItems: HTMLElement[];

    // TODO: ADD class for when activeIndex matches this tab index so the tab is highlighted properly.

    public handleFlipperClick(direction: 1 | -1, e: Event): void {
        this.incrementSlide(direction);
    }

    public handlePlayClick(e: Event): void {
        e.preventDefault();
        this.togglePlay();
    }

    private tabPanelIds: string[] = [];
    private activeIndex: number = 0;

    private change = (): void => {
        this.$emit("change", this.activeId);
    };

    private incrementSlide = (direction: 1 | -1): void => {
        this.activeIndex = wrapInBounds(
            0,
            this.tabPanelIds.length - 1,
            this.activeIndex + direction
        );
        this.activeId = this.tabPanelIds[this.activeIndex];
    };

    private autoplayNextItem = (): void => {
        this.incrementSlide(1);
    };

    private generateTabPanelIds(): void {
        this.tabPanelIds = [];
        for (let i = 0; i < this.filteredItems.length; i++) {
            this.tabPanelIds.push(`tab-${i + 1}`);
        }
    }

    private togglePlay(): void {
        this.paused = !this.paused;

        if (!this.paused) {
            this.startAutoPlay();
        } else {
            this.stopAutoPlay();
        }
    }

    private startAutoPlay(): void {
        if (isNil(this.autoplayTimer)) {
            this.autoplay = true;
            this.autoplayTimer = window.setInterval(
                this.autoplayNextItem,
                this.autoplayInterval
            );
        }
    }

    private stopAutoPlay(): void {
        if (!isNil(this.autoplayTimer)) {
            this.autoplay = false;
            this.autoplayTimer = window.clearInterval(this.autoplayTimer as number);
        }
    }

    // constructor() {
    // super();
    // }

    public connectedCallback(): void {
        super.connectedCallback();
        if (this.autoplay) {
            this.startAutoPlay();
        } else {
            this.paused = true;
        }
    }

    public disconnectedCallback(): void {
        super.disconnectedCallback();
        this.stopAutoPlay();
    }

    private autoplayTimer: number | void;
}
