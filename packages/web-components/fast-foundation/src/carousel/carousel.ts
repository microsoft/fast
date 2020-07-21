import { attr, observable, DOM } from "@microsoft/fast-element";
import { Tabs } from "../tabs";
import {
    keyCodeSpace,
    keyCodeEnter,
    wrapInBounds,
    limit,
    KeyCodes,
} from "@microsoft/fast-web-utilities";

const tabPanelPrefix: string = "panel-";

const tabPrefix: string = "tab-";

/**
 * An Carousel Custom HTML Element.
 * Implements the {@link https://www.w3.org/TR/wai-aria-1.1/#carousel | ARIA carousel }.
 *
 * @public
 */
export class Carousel extends Tabs {
    @attr({ mode: "fromView" })
    public autoplay: boolean = true;

    @attr({ mode: "fromView" })
    public loop: boolean = true;

    @attr({ mode: "boolean" })
    public paused: boolean = false;
    public pausedChanged(): void {
        if (!this.paused) {
            this.focused = false;
            this.notabfocus = true;
            this.startAutoPlay();
        } else {
            this.notabfocus = false;
            this.stopAutoPlay();
        }
        if (this.change) {
            this.change();
        }
    }

    @attr({ attribute: "basicpattern", mode: "boolean" })
    public basicPattern: boolean = false;

    @attr({ attribute: "autoplay-interval" })
    public autoplayInterval: number = 6000;

    @attr({ attribute: "activeslideid" })
    public activeSlideId: string;
    public activeSlideIdChanged(): void {
        this.activeSlideIndex = this.slideIds.indexOf(this.activeSlideId);
    }

    @attr({ attribute: "aria-labelledby" })
    public arialabelledby: string;

    @attr({ attribute: "aria-label" })
    public arialabel: string;

    @observable
    public focused: boolean = false;
    public focusedChanged() {
        if (this.focused) {
            this.notabfocus = false;
        } else {
            this.notabfocus = true;
        }
    }

    /**
     * Whether or not to focus the tab on change
     * @public
     * HTML Attribute: notabfocus
     */
    @observable
    public notabfocus: boolean = true;
    public nottabfocusChanged(): void {}

    public setComponent(): void {
        this.activeid = this.tabIds[this.activeTabIndex] as string;
        this.change();
        this.setTabs();
        this.handleActiveIndicatorPosition();
        this.setTabPanels();
        if (!this.notabfocus) {
            this.focusTab();
        }
        this.change();
    }

    @observable
    public activeindicator = false;
    public activeSlideIndex: number = 0;
    public basicContentRef: HTMLDivElement;
    public carousel: HTMLDivElement;
    public previousButtonItem: HTMLElement[];
    public nextButtonItem: HTMLElement[];
    public rotationControl: HTMLElement;
    public rotationControlItem: HTMLElement[];
    public tabsRef: HTMLElement;
    public tabPanelsRef: HTMLElement;

    @observable
    public items: HTMLElement[];
    public itemsChanged(): void {
        if (this.items.length && this.basicPattern) {
            this.generateSlideIds();

            //sethdonohue - if activeSlideId attribute was set by implementation then we need to sync the activeSlideIndex for incrementing to work
            if (this.activeSlideId) {
                this.activeSlideIndex = this.slideIds.indexOf(this.activeSlideId);
            } else {
                this.activeSlideId = this.slideIds[this.activeSlideIndex] as string;
            }

            this.items.forEach((item: HTMLElement, index: number) => {
                if (index === this.activeSlideIndex) {
                    item.classList.add("active-slide");
                    item.removeAttribute("hidden");
                } else {
                    item.setAttribute("hidden", "");
                }
                if (
                    !item.getAttribute("aria-label") ||
                    !item.getAttribute("aria-labelledby")
                ) {
                    item.setAttribute(
                        "aria-label",
                        `${index + 1} of ${this.items.length}`
                    );
                }

                item.setAttribute(
                    "id",
                    item.getAttribute("id")
                        ? (item.getAttribute("id") as string)
                        : `slide-${index + 1}`
                );

                item.classList.add("slide");
                // sethdonohue - per ARIA spec role=group and roledescription=slide must be on the slide container for basicPattern (not tabbed) implementation
                item.setAttribute("role", "group");
                item.setAttribute("aria-roledescription", "slide");

                return item;
            });
        }
    }

    public handleFlipperClick(direction: 1 | -1, e: Event): void {
        this.incrementSlide(direction);
    }

    public handleFlipperKeypress = (direction: 1 | -1, e: KeyboardEvent): void => {
        switch (e.keyCode) {
            case keyCodeEnter:
            case keyCodeSpace:
                this.paused = true;
                this.incrementSlide(direction);
                break;
        }
    };

    public change = (): void => {
        // sethdonohue - reference to carousel is passed for the author to get access to the paused, activeSlideId, and other states.
        this.$emit("change", this.carousel);
    };

    public adjust(adjustment: number): void {
        this.prevActiveTabIndex = this.activeTabIndex;
        if (this.loop) {
            this.activeTabIndex = wrapInBounds(
                0,
                this.tabs.length - 1,
                this.activeTabIndex + adjustment
            );
        } else {
            this.activeTabIndex = limit(
                0,
                this.tabs.length - 1,
                this.activeTabIndex + adjustment
            );
        }
        this.setComponent();
    }

    private slideIds: string[] = [];
    private autoplayTimer: number | void;
    private pausedTimeout: number | void;
    private firstFocus: boolean = true;
    private startTime: number = 0;
    private stopTime: number = 0;

    private incrementSlide = (direction: 1 | -1): void => {
        const tempLength: number = this.basicPattern
            ? this.items.length
            : this.tabs.length;
        const tempIndex: number = this.basicPattern
            ? this.activeSlideIndex
            : this.activeTabIndex;
        this.focused = false;
        let adjustment: number = 0;

        if (this.basicPattern) {
            if (this.loop) {
                adjustment = wrapInBounds(0, tempLength - 1, tempIndex + direction);
            } else {
                adjustment = limit(0, tempLength - 1, tempIndex + direction);
            }
            this.activeSlideId = this.slideIds[adjustment];
            this.itemsChanged();
        } else {
            this.adjust(direction);
            this.focused = true;
        }

        this.change();
    };

    private autoplayNextItem = (): void => {
        this.startTime = Date.now();
        this.incrementSlide(1);
    };

    private generateSlideIds(): void {
        this.slideIds = [];
        // for (let i = 0; i < this.items.length; i++) {
        //     this.slideIds.push(`slide-${i + 1}`);
        // }
        this.slideIds = this.items.map((item: HTMLElement, index: number) => {
            return item.getAttribute("id")
                ? (item.getAttribute("id") as string)
                : `slide-${index + 1}`;
        });
    }

    private togglePlay(): void {
        this.paused = !this.paused;
    }

    private startAutoPlay(): void {
        if (!this.paused) {
            this.stopAutoPlay();
            this.startTime = Date.now();
            this.autoplayTimer = window.setInterval(
                this.autoplayNextItem,
                this.autoplayInterval
            );
        }
    }

    private stopAutoPlay(): void {
        this.autoplayTimer = window.clearInterval(this.autoplayTimer as number);
    }

    private handleRotationMouseDown = (e: Event): void => {
        if (this.firstFocus) {
            this.firstFocus = false;
        }
        this.togglePlay();
    };

    private handleRotationKeyDown = (e: KeyboardEvent) => {
        switch (e.keyCode) {
            case keyCodeEnter:
            case keyCodeSpace:
                this.handleRotationMouseDown(e);
                break;
        }
    };

    private handleFocusIn = (e: FocusEvent): void => {
        // sethdonohue - per ARIA spec we need to stop rotation whenever keyboard focus is brought to the carousel unless the user specifically requests it to start again
        // sethdonohue - if firstFocus is true then we are focusing in with the keyboard and not the mousedown fired off of the rotation control so we can still pause. This prevents toggle being fired twice if the rotation control click event is also the first focus event on the carousel
        if (this.firstFocus) {
            if (this.autoplay) {
                this.paused = true;
            }
            this.firstFocus = false;
        }
    };

    private handleBlur(e: Event): void {
        this.focused = false;
    }

    private handleMouseOver = () => {
        if (!this.paused) {
            this.stopTime = Date.now();
            window.clearTimeout(this.pausedTimeout as number);
            this.stopAutoPlay();
        }
    };

    private handleMouseLeave = () => {
        if (!this.paused) {
            // sethdonohue - timer for proper pause of rotation
            const timeDiff: number =
                this.autoplayInterval - (this.stopTime - this.startTime);
            if (timeDiff) {
                window.clearTimeout(this.pausedTimeout as number);
                window.clearInterval(this.autoplayTimer as number);
                this.pausedTimeout = setTimeout(() => {
                    this.autoplayNextItem();
                    this.startAutoPlay();
                }, timeDiff);
            }
        }
        this.focused = false;
    };

    private handleTabsKeypress = (e: KeyboardEvent): void => {
        // sethdonohue - pause the carousel if the right, left, home, end keys are pressed in the case of when autoplay has been restarted by the user and the focus is on the tabs
        switch (e.keyCode) {
            case KeyCodes.arrowLeft:
            case KeyCodes.arrowRight:
            case KeyCodes.home:
            case KeyCodes.end:
                this.paused = true;
                break;
        }
    };

    private handleTabsFocusIn = (e: FocusEvent): void => {
        this.focused = true;
        e.stopPropagation();
        if (this.firstFocus) {
            this.paused = true;
        }
        this.firstFocus = false;
    };

    private handleTabsFocusOut = (e: FocusEvent): void => {
        // sethdonohue - if we focus out of tabs or any tabs children we need to ensure tabs doesn't steal focus
        this.focused = false;
        // sethdonohue - if we focus outside of the carousel then first focus needs to be reset
        if (!this.carousel.contains(e.relatedTarget as Node)) {
            this.firstFocus = true;
        }
    };

    public connectedCallback(): void {
        super.connectedCallback();
        if (this.autoplay) {
            this.startAutoPlay();
        } else {
            this.paused = true;
        }

        // sethdonohue - per ARIA autoplay must pause when mouse is hovering over the carousel
        this.carousel.addEventListener("mouseover", this.handleMouseOver);
        this.carousel.addEventListener("mouseleave", this.handleMouseLeave);

        // sethdonohue - per ARIA rotating must stop when keyboard focus enters the carousel and not restart unless the user explicitly requests it to.
        this.carousel.addEventListener("focusin", this.handleFocusIn);
        this.carousel.addEventListener("blur", this.handleBlur);

        // sethdonohue - using mousedown as this fires before focusin so we can account for the first click on the rotation control and the focus immediately following click. This also requires the use of keydown since click is not used
        this.rotationControl.addEventListener("mousedown", this.handleRotationMouseDown);
        this.rotationControl.addEventListener("keydown", this.handleRotationKeyDown);

        if (!this.basicPattern) {
            this.tabsRef.addEventListener("keydown", this.handleTabsKeypress);
            this.tabsRef.addEventListener("focusin", this.handleTabsFocusIn);
            this.tabsRef.addEventListener("focusout", this.handleTabsFocusOut);

            this.tabPanelsRef.addEventListener("focusin", this.handleMouseOver);
            this.tabPanelsRef.addEventListener("focusout", this.handleMouseLeave);

            if (this.previousButtonItem.length && this.nextButtonItem.length) {
                // sethdonohue - when tabbed the next and previous buttons should not be in the tab sequence
                DOM.queueUpdate(() => {
                    this.previousButtonItem[0].setAttribute("tabindex", "-1");
                    this.nextButtonItem[0].setAttribute("tabindex", "-1");
                });
            }
        } else {
            this.basicContentRef.addEventListener("focusin", this.handleMouseOver);
            this.basicContentRef.addEventListener("focusout", this.handleMouseLeave);
        }
    }

    public disconnectedCallback(): void {
        super.disconnectedCallback();
        this.stopAutoPlay();
    }
}
