import { FASTElement, observable, attr } from "@microsoft/fast-element";
import { applyMixins, StartEnd } from "@microsoft/fast-foundation";
import { NavigationItem } from "../navigation-item/navigation-item";

export class Navigation extends FASTElement {
    @attr({
        attribute: "menu",
        mode: "boolean",
    })
    menu: boolean;

    @observable
    opened: boolean = false;

    @observable
    debounce: boolean = true;

    @observable
    slottedNavigationItems: Node[];

    widthOffset: number;

    mediaQueryList: MediaQueryList;

    htmlElement: HTMLElement = document.body.parentElement as HTMLElement;

    mqlListener = (e: MediaQueryListEvent): void => {
        this.debounce = true;

        if (!e.matches) {
            this.opened = false;
        }
    };

    openedChanged(): void {
        this.widthOffset = window.innerWidth - document.body.clientWidth;
        if (this.htmlElement) {
            this.htmlElement.style.setProperty("--width-offset", `${this.widthOffset}`);
            this.htmlElement.classList.toggle("menu-opened", this.opened);
        }
    }

    menuChanged() {
        if (this.menu) {
            this.mediaQueryList = window.matchMedia("screen and (max-width: 900px)");
            this.mediaQueryList.addListener(this.mqlListener);
        }
    }

    connectedCallback() {
        super.connectedCallback();
    }

    toggleOpened(force?: boolean): void {
        this.opened = force ? force : !this.opened;
        this.debounce = false;
    }

    handleFocusOut = (e: FocusEvent): void => {
        let captured = e.relatedTarget as Node;
        let contains = this.contains(captured);

        if (!captured) {
            captured = e.target as Node;
            contains = this.contains(captured);

            if (!this.isSameNode(captured) && !contains && this.opened) {
                this.toggleOpened();
                return;
            }
        }

        if (contains || (!contains && !this.opened)) {
            return;
        }

        this.toggleOpened();
    };
}

/* eslint-disable-next-line */
export interface Navigation extends StartEnd {}
applyMixins(Navigation, StartEnd);
