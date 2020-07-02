// TODO: ADD animations and classes to previous, current, next slides???
// TODO: CHECK for error states, compare with other components
// TODO: ADD more examples to test timer, loop, etc...
// TODO: ADD keyboard controls
// TODO: CHECK tab index of all controls
// TODO: ADD accessibility features, compare to SPEC and other components

// TODO: Since this is a new component you will have to add the definition to the definitions folder in site-utilities
// TODO: ADD change $emit, for active slide and paused?

// TODO: BUTTON controls ( next, previous, rotate start/stop) do not move focus
// TODO: HIDE flippers when not hovering over carousel
import { attr, DOM, FASTElement, observable } from "@microsoft/fast-element";
import { KeyCodes, wrapInBounds, limit } from "@microsoft/fast-web-utilities";
import { isNil } from "lodash-es";
import { keyCodeSpace, keyCodeEnter } from "@microsoft/fast-web-utilities";

export const panelPrefix: string = "tabpanel-";

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

        if (!this.tabbed) {
            this.filteredItems = this.filteredItems.map(
                (item: HTMLElement, index: number) => {
                    item.setAttribute("id", `${panelPrefix}${index + 1}`);
                    item.setAttribute("aria-hidden", "false");
                    if (index === this.activeIndex) {
                        item.classList.add("active-slide");
                        item.removeAttribute("hidden");
                    } else {
                        item.setAttribute("hidden", "");
                    }
                    // if (index === this.activeIndex + 1) {
                    //     item.classList.add("next-slide");
                    // } else if (index === this.activeIndex - 1) {
                    //     item.classList.add("previous-slide");
                    //     // TODO: ADD class for looped slides, if -1 doesn't exist then use length -1 slide.
                    // }

                    item.classList.add("slide");
                    item.setAttribute("role", "tabpanel");
                    // TODO: ASK add aria-labelledby?
                    return item;
                }
            );
        }
        //TODO: NEED TO FILTER BETTER so that i don't remove text nodes that may actually be content
        //  - text nodes are not stylable though...
    }

    @observable
    public filteredItems: HTMLElement[];

    public handleFlipperClick(direction: 1 | -1, e: Event): void {
        this.incrementSlide(direction);
    }

    public handleKeypress = (direction: 1 | -1, e: KeyboardEvent): void => {
        switch (e.keyCode) {
            case keyCodeSpace:
            case keyCodeEnter:
                this.incrementSlide(direction);
                break;
        }
    };

    public handlePlayClick(e: Event): void {
        e.preventDefault();
        this.togglePlay();
    }

    private tabPanelIds: string[] = [];
    public activeIndex: number = 0;

    private change = (): void => {
        this.$emit("change", this.activeId);
    };

    private incrementSlide = (direction: 1 | -1): void => {
        this.activeIndex = wrapInBounds(
            0,
            this.filteredItems.length - 1,
            this.activeIndex + direction
        );
        this.activeId = this.tabPanelIds[this.activeIndex];

        if (!this.tabbed) {
            this.itemsChanged();
        }

        this.change();
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
            this.autoplayTimer = window.setInterval(
                this.autoplayNextItem,
                this.autoplayInterval
            );
        }
    }

    private stopAutoPlay(): void {
        if (!isNil(this.autoplayTimer)) {
            this.autoplayTimer = window.clearInterval(this.autoplayTimer as number);
        }
    }

    private pause(): void {
        if (!this.paused && this.autoplay) {
            this.paused = true;
        }
        if (this.autoplay) {
            this.stopAutoPlay();
        }
    }

    private play(): void {
        if (this.paused && this.autoplay) {
            this.paused = false;
        }
        if (this.autoplay) {
            this.startAutoPlay();
        }
    }

    private handleFocusIn(e: Event): void {
        this.pause();
        this.autoplay = false;
    }

    public connectedCallback(): void {
        super.connectedCallback();
        if (this.autoplay) {
            this.startAutoPlay();
        } else {
            this.paused = true;
        }

        // sethdonohue - per ARIA autoplay must stop when mouse is hovering over the carousel
        this.carousel.addEventListener("mouseover", this.pause);
        this.carousel.addEventListener("mouseleave", this.play);

        // sethdonohue - per ARIA rotating must stop when keyboard focus enters the carousel and not restart unless the user explicitly requests it to.
        this.carousel.addEventListener("focusin", this.handleFocusIn);
    }

    public disconnectedCallback(): void {
        super.disconnectedCallback();
        this.stopAutoPlay();
    }

    private autoplayTimer: number | void;
}
