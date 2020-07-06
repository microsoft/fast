// TODO: CHECK for error states
// TODO: Double CHECK ALL accessibility features, compare to SPEC and other components
// TODO: ADD to the definitions folder in site-utilities

import { attr, FASTElement, observable } from "@microsoft/fast-element";
import {
    keyCodeSpace,
    keyCodeEnter,
    wrapInBounds,
    limit,
    KeyCodes,
} from "@microsoft/fast-web-utilities";
import { isNil } from "lodash-es";

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

    @attr({ attribute: "aria-describedby" })
    public ariaDescribedby: string;

    @attr({ attribute: "aria-labelledby" })
    public ariaLabelledby: string;

    @attr({ attribute: "aria-label" })
    public ariaLabel: string;

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
    public activeId: string;
    public activeIdChanged(): void {
        this.activeIndex = this.tabIds.indexOf(this.activeId);
    }

    @attr({ attribute: "tabbed", mode: "boolean" })
    public tabbed: boolean = true;

    public carousel: HTMLDivElement;

    @observable
    public items: HTMLElement[];
    public itemsChanged(): void {
        this.filteredItems = this.items.filter(
            (item: HTMLElement) => item.nodeType === 1
        );
        this.generateTabIds();

        //sethdonohue - if activeid attribute was set by implementation then we need to sync the activeIndex for incrementing to work
        if (this.activeId) {
            this.activeIndex = this.tabIds.indexOf(this.activeId);
        } else {
            this.activeId = this.tabIds[this.activeIndex] as string;
        }

        if (!this.tabbed) {
            this.filteredItems = this.filteredItems.map(
                (item: HTMLElement, index: number) => {
                    item.setAttribute("id", `${tabPanelPrefix}${index + 1}`);
                    item.setAttribute("aria-hidden", "false");
                    if (index === this.activeIndex) {
                        item.classList.add("active-slide");
                        item.removeAttribute("hidden");
                    } else {
                        item.setAttribute("hidden", "");
                    }
                    item.classList.add("slide");
                    item.setAttribute("role", "tabpanel");
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

    public handlePlayClick(e: Event): void {
        e.preventDefault();
        e.stopPropagation();
        this.togglePlay();
    }

    private tabIds: string[] = [];
    private activeIndex: number = 0;
    private autoplayTimer: number | void;

    private change = (): void => {
        this.$emit("change", this.activeId);
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

        this.activeId = this.tabIds[this.activeIndex];

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
        this.autoplay = false;
    }

    private startAutoPlay(): void {
        this.stopAutoPlay();
        this.autoplayTimer = window.setInterval(
            this.autoplayNextItem,
            this.autoplayInterval
        );
    }

    private stopAutoPlay(): void {
        this.autoplayTimer = window.clearInterval(this.autoplayTimer as number);
    }

    private handleFocusIn(e: Event): void {
        this.paused = true;
        this.autoplay = false;
    }

    private handleMouseOver(E: Event) {
        if (this.autoplay) {
            this.paused = true;
        }
    }

    private handleMouseLeave(E: Event) {
        if (this.autoplay) {
            this.paused = false;
        }
    }

    private handleTabChange(e: any): void {
        if (e.detail.id) {
            this.activeIndex = this.tabIds.indexOf(e.detail.id);
            this.activeId = e.detail.id;
        }
    }

    private handleCarouselKeypress(e: KeyboardEvent): void {
        // sethdonohue - pause the carousel if the right or left arrows are pressed in the case of when autoplay has been restarted by the user and the  focus is on the tabs.
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

        // sethdonohue - per ARIA autoplay must stop when mouse is hovering over the carousel
        this.carousel.addEventListener("mouseover", this.handleMouseOver);
        this.carousel.addEventListener("mouseleave", this.handleMouseLeave);

        // sethdonohue - per ARIA rotating must stop when keyboard focus enters the carousel and not restart unless the user explicitly requests it to.
        this.carousel.addEventListener("focusin", this.handleFocusIn);

        this.carousel.addEventListener("change", this.handleTabChange);

        this.carousel.addEventListener("keydown", this.handleCarouselKeypress);
    }

    public disconnectedCallback(): void {
        super.disconnectedCallback();
        this.stopAutoPlay();
    }
}
