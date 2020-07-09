// TODO: CHECK for error states
// TODO: Double CHECK ALL accessibility features, compare to SPEC and other components

import { attr, FASTElement, observable } from "@microsoft/fast-element";
import {
    keyCodeSpace,
    keyCodeEnter,
    wrapInBounds,
    limit,
    KeyCodes,
} from "@microsoft/fast-web-utilities";

/**
 * The panel id prefix
 * @public
 */
export const tabPanelPrefix: string = "panel-";

const tabPrefix: string = "tab-";

/**
 * An Carousel Custom HTML Element.
 * Implements the {@link https://www.w3.org/TR/wai-aria-1.1/#carousel | ARIA carousel }.
 *
 * @public
 */
export class Carousel extends FASTElement {
    @attr({ mode: "boolean" })
    public autoplay: boolean = true;

    @attr({ attribute: "autoplay-interval" })
    public autoplayInterval: number = 6000;

    @attr({ mode: "boolean" })
    public loop: boolean = true;

    @attr({ attribute: "aria-labelledby" })
    public arialabelledby: string;

    @attr({ attribute: "aria-label" })
    public arialabel: string;

    @attr({ mode: "boolean" })
    public paused: boolean = false;
    public pausedChanged(): void {
        if (!this.paused) {
            this.startAutoPlay();
        } else {
            this.stopAutoPlay();
        }
    }

    @attr({ attribute: "activeid" })
    public activeid: string;
    public activeidChanged(): void {
        this.activeIndex = this.tabIds.indexOf(this.activeid);
    }

    @attr({ mode: "boolean" })
    public tabbed: boolean = true;

    @observable
    public focused: boolean = false;

    public carousel: HTMLDivElement;
    public tabs: HTMLElement;
    public activeSlide: HTMLElement;
    public previousButton: HTMLElement[];
    public nextButton: HTMLElement[];

    @observable
    public items: HTMLElement[];
    public itemsChanged(): void {
        this.filteredItems = this.items.filter(
            (item: HTMLElement) => item.nodeType === 1
        );
        this.generateTabIds();

        //sethdonohue - if activeid attribute was set by implementation then we need to sync the activeIndex for incrementing to work
        if (this.activeid) {
            this.activeIndex = this.tabIds.indexOf(this.activeid);
        } else {
            this.activeid = this.tabIds[this.activeIndex] as string;
        }

        if (!this.tabbed) {
            this.filteredItems = this.filteredItems.map(
                (item: HTMLElement, index: number) => {
                    if (index === this.activeIndex) {
                        item.classList.add("active-slide");
                        item.removeAttribute("hidden");
                        this.activeSlide = item;
                    } else {
                        item.setAttribute("hidden", "");
                    }
                    if (
                        !item.getAttribute("aria-label") ||
                        !item.getAttribute("aria-labelledby")
                    ) {
                        item.setAttribute(
                            "aria-label",
                            `${index + 1} of ${this.filteredItems.length}`
                        );
                    }

                    item.setAttribute("id", `${tabPanelPrefix}${index + 1}`);
                    item.classList.add("slide");
                    // sethdonohue - per ARIA spec role=group and roledescription=slide must be on the slide container for basic (not tabbed) implementation
                    item.setAttribute("role", "group");
                    item.setAttribute("aria-roledescription", "slide");

                    return item;
                }
            );
        }
    }

    @observable
    public filteredItems: HTMLElement[];

    public handleFlipperClick(direction: 1 | -1, e: Event): void {
        this.incrementSlide(direction);
    }

    public handleFlipperKeypress = (direction: 1 | -1, e: KeyboardEvent): void => {
        switch (e.keyCode) {
            case keyCodeSpace:
            case keyCodeEnter:
                this.paused = true;
                this.incrementSlide(direction);
                break;
        }
    };

    public handleRotationClick(e: Event): void {
        e.preventDefault();
        e.stopPropagation();
        this.togglePlay();
    }

    private tabIds: string[] = [];
    private activeIndex: number = 0;
    private autoplayTimer: number | void;

    private change = (): void => {
        this.$emit("change", this.activeSlide);
    };

    private incrementSlide = (direction: 1 | -1): void => {
        if (this.loop) {
            this.activeIndex = wrapInBounds(
                0,
                this.filteredItems.length - 1,
                this.activeIndex + direction
            );
        } else {
            this.activeIndex = limit(
                0,
                this.filteredItems.length - 1,
                this.activeIndex + direction
            );
        }

        this.activeid = this.tabIds[this.activeIndex];

        if (!this.tabbed) {
            this.itemsChanged();
        }
        this.change();
    };

    private autoplayNextItem = (): void => {
        this.incrementSlide(1);
    };

    private generateTabIds(): void {
        this.tabIds = [];
        for (let i = 0; i < this.filteredItems.length; i++) {
            this.tabIds.push(`${tabPrefix}${i + 1}`);
        }
    }

    private togglePlay(): void {
        this.paused = !this.paused;
        if (this.paused) {
            // sethdonohue - the user has specifically stopped rotation, so autoplay should be turned off
            this.autoplay = false;
        } else {
            this.focused = false;
        }
    }

    private startAutoPlay(): void {
        // sethdonohue - need to clear the timer before starting a new one
        this.stopAutoPlay();
        this.autoplayTimer = window.setInterval(
            this.autoplayNextItem,
            this.autoplayInterval
        );
    }

    private stopAutoPlay(): void {
        this.autoplayTimer = window.clearInterval(this.autoplayTimer as number);
    }

    private handleFocus(e: Event): void {
        if (this.autoplay) {
            this.stopAutoPlay();
        }
        this.focused = true;
    }

    private handleBlur(e: Event): void {
        this.focused = false;
    }

    private handleMouseOver = (e: Event) => {
        if (this.autoplay) {
            // this.paused = true;
            this.stopAutoPlay();
        }
    };

    private handleMouseLeave = (e: Event) => {
        if (this.autoplay) {
            // this.paused = false;
            this.startAutoPlay();
        }
    };

    private handleTabChange = (e: any): void => {
        if (e.target.activeid) {
            this.activeid = e.target.activeid;
            this.activeIndex = this.tabIds.indexOf(this.activeid);
        }
    };

    private handleCarouselKeypress(e: KeyboardEvent): void {
        // sethdonohue - pause the carousel if the right or left arrows are pressed in the case of when autoplay has been restarted by the user and the focus is on the tabs
        switch (e.keyCode) {
            case KeyCodes.arrowLeft:
            case KeyCodes.arrowRight:
                this.paused = true;
                break;
        }
    }

    public connectedCallback(): void {
        super.connectedCallback();
        if (this.autoplay) {
            this.startAutoPlay();
        } else {
            this.paused = true;
        }
        this.carousel.addEventListener("keydown", this.handleCarouselKeypress);

        // sethdonohue - per ARIA autoplay must pause when mouse is hovering over the carousel
        this.carousel.addEventListener("mouseover", this.handleMouseOver);
        this.carousel.addEventListener("mouseleave", this.handleMouseLeave);

        // sethdonohue - per ARIA rotating must stop when keyboard focus enters the carousel and not restart unless the user explicitly requests it to.
        this.carousel.addEventListener("focus", this.handleFocus);
        this.carousel.addEventListener("blur", this.handleBlur);

        if (this.tabbed) {
            // sethdonohue - get the id of the tab change based on the change event emitted from tabs to keep carousel in sync with tabs
            this.tabs.addEventListener("change", this.handleTabChange);

            // sethdonohue - when tabbed the next and previous buttons should not be tabbable
            if (this.previousButton.length && this.nextButton.length) {
                this.previousButton[0].setAttribute("tabindex", "-1");
                this.nextButton[0].setAttribute("tabindex", "-1");
            }
        }
    }

    public disconnectedCallback(): void {
        super.disconnectedCallback();
        this.stopAutoPlay();
    }
}
