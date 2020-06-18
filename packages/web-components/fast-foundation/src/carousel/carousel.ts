// TODO: ADD flipper functionality
// TODO: ADD animations and classes to previous, current, next slides
// TODO: CHECK for error states, compare with other components
// TODO: ADD more examples to test autoplay, timer, loop, etc...
// TODO: ADD keyboard controls
// TODO: ADD accessibility features, compare to SPEC and other components
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
    public activeId: string;

    public carousel: HTMLDivElement;

    @observable
    public items: HTMLElement[];
    public itemsChanged(): void {
        this.filteredItems = this.items
            .filter((item: HTMLElement) => item.nodeType === 1)
            //TODO: NEED TO FILTER BETTER so that i don't remove text nodes that may actually be content
            //  - text nodes are not stylable though...
            .map((item: HTMLElement, index: number) => {
                if (index === this.activeTabIndex) {
                    item.classList.add("active-slide");
                    item.setAttribute("aria-hidden", "false");
                    item.removeAttribute("hidden");
                } else {
                    item.setAttribute("hidden", "");
                    item.setAttribute("aria-hidden", "true");
                }
                if (index === this.activeTabIndex + 1) {
                    item.classList.add("next-slide");
                } else if (index === this.activeTabIndex - 1) {
                    item.classList.add("previous-slide");
                    // TODO: ADD class for looped slides, if -1 doesn't exist then use length -1 slide.
                }

                item.classList.add("slide");
                item.setAttribute("role", "tabpanel");
                // TODO: ASK add aria-labelledby?
                return item;
            });
    }

    @observable
    public filteredItems: HTMLElement[];

    @observable
    public tabs: HTMLElement[];
    public tabsChanged(): void {
        this.tabs.forEach((tab: HTMLElement, index: number) => {
            tab.addEventListener("click", this.handleTabClick(index));
            tab.setAttribute("role", "tab");
            if (this.activeTabIndex === index) {
                tab.setAttribute("aria-selected", "true");
            } else {
                tab.setAttribute("aria-selected", "false");
            }
            //TODO: ADD class for when activeIndex matches this tab index so the tab is highlighted properly.
        });
    }

    public handleFlipperClick(direction: 1 | -1, e: Event): void {
        this.incrementItem(direction);
    }

    public connectedCallback(): void {
        super.connectedCallback();

        this.carousel.addEventListener("keydown", this.handelKeyDown);

        if (this.autoplay) {
            this.autoplayTimer = window.setInterval(
                this.incrementItem,
                this.autoplayInterval
            );
        }
    }

    public disconnectedCallback(): void {
        super.disconnectedCallback();
        // this.carousel.removeEventListener("keydown");
        if (!isNil(this.autoplayTimer)) {
            this.autoplayTimer = window.clearInterval(this.autoplayTimer as number);
        }
    }

    private autoplayTimer: number | void;

    private activeTabIndex: number = 0;

    private handleTabClick(index: number): (e: Event) => void {
        return (e: Event): void => {
            this.activeTabIndex = index;
            this.itemsChanged();
        };
    }

    private incrementItem = (direction: 1 | -1 = 1): void => {
        this.activeTabIndex = this.loop
            ? wrapInBounds(
                  0,
                  this.filteredItems.length - 1,
                  this.activeTabIndex + direction
              )
            : limit(0, this.filteredItems.length - 1, this.activeTabIndex + direction);

        this.itemsChanged();
    };

    private handelKeyDown = (e: KeyboardEvent): void => {
        switch (e.keyCode) {
            case KeyCodes.arrowLeft:
            case KeyCodes.arrowUp:
                e.stopPropagation();
                e.preventDefault();
                this.incrementItem(-1);
                break;
            case KeyCodes.arrowRight:
            case KeyCodes.arrowDown:
                e.preventDefault();
                e.stopPropagation();
                this.incrementItem(1);
                break;
        }
    };
}
