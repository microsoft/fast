import { FASTElement, observable } from "@microsoft/fast-element";
import { applyMixins, StartEnd } from "@microsoft/fast-foundation";
import { keyCodeEscape, keyCodeTab } from "@microsoft/fast-web-utilities";

export class Navigation extends FASTElement {
    @observable
    public opened: boolean = false;

    @observable
    public debounce: boolean = true;

    public closeButton: HTMLElement;

    private firstTabStop: HTMLElement | null = null;

    private mediaQueryList: MediaQueryList;

    private mqlListener = (e: MediaQueryListEvent): void => {
        this.debounce = true;

        if (!e.matches) {
            this.opened = false;
        }
    };

    private openModal() {
        const navPane = document.querySelector(".site-navigation");
        const focusableElementString = "fast-anchor";

        if (navPane) {
            let focusableElement: NodeListOf<Element> = navPane.querySelectorAll(
                focusableElementString
            );

            this.firstTabStop = focusableElement[0] as HTMLElement;

            this.closeButton.focus();

            document.addEventListener("keydown", this.trapTabKey);
            focusableElement = Array.prototype.slice.call(focusableElement);
        }
    }

    constructor() {
        super();

        this.mediaQueryList = window.matchMedia("screen and (max-width: 800px)");
        this.mediaQueryList.addListener(this.mqlListener);
    }

    public handleOpenNavClick = (e: Event): void => {
        this.opened = !this.opened;
        this.debounce = false;
        this.openModal();
    };

    public trapTabKey = (e: KeyboardEvent) => {
        if (!e.defaultPrevented) {
            switch (e.keyCode) {
                case keyCodeTab:
                    this.handleTabKeyDown(e);
                    break;
            }
        }
    };

    public handleTabKeyDown = (e: KeyboardEvent) => {
        if (this.firstTabStop === null || this.closeButton === null) {
            return;
        }
        if (e.shiftKey) {
            if (document.activeElement === this.firstTabStop) {
                e.preventDefault();
                this.closeButton.focus();
            }
        } else {
            if (document.activeElement === this.closeButton) {
                e.preventDefault();
                this.firstTabStop.focus();
            }
        }
    };
}

/* eslint-disable-next-line */
export interface Navigation extends StartEnd {}
applyMixins(Navigation, StartEnd);
