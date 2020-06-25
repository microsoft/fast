import { FASTElement, observable } from "@microsoft/fast-element";
import { applyMixins, StartEnd } from "@microsoft/fast-foundation";

export class Navigation extends FASTElement {
    @observable
    public opened: boolean = false;

    @observable
    public debounce: boolean = true;

    private mediaQueryList: MediaQueryList;

    private mqlListener = (e: MediaQueryListEvent): void => {
        this.debounce = true;

        if (!e.matches) {
            this.opened = false;
        }
    };

    connectedCallback() {
        super.connectedCallback();

        this.mediaQueryList = window.matchMedia("screen and (max-width: 800px)");
        this.mediaQueryList.addListener(this.mqlListener);
    }

    public toggleOpened(): void {
        const htmlElement = document.body.parentElement as HTMLElement;
        const widthOffset = window.innerWidth - document.body.clientWidth;

        this.opened = !this.opened;
        this.debounce = false;

        htmlElement.style.setProperty("--width-offset", `${widthOffset}`);
        htmlElement.classList.toggle("menu-opened", this.opened);
    }

    public handleFocusOut = (e: FocusEvent): void => {
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
