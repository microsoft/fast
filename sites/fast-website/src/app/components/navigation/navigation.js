var __decorate =
    (this && this.__decorate) ||
    function (decorators, target, key, desc) {
        var c = arguments.length,
            r =
                c < 3
                    ? target
                    : desc === null
                    ? (desc = Object.getOwnPropertyDescriptor(target, key))
                    : desc,
            d;
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function")
            r = Reflect.decorate(decorators, target, key, desc);
        else
            for (var i = decorators.length - 1; i >= 0; i--)
                if ((d = decorators[i]))
                    r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
import { FASTElement, observable, attr } from "@microsoft/fast-element";
import { applyMixins, StartEnd } from "@microsoft/fast-foundation";
export class Navigation extends FASTElement {
    constructor() {
        super(...arguments);
        this.opened = false;
        this.debounce = true;
        this.htmlElement = document.body.parentElement;
        this.mqlListener = e => {
            this.debounce = true;
            if (!e.matches) {
                this.opened = false;
            }
        };
        this.handleFocusOut = e => {
            let captured = e.relatedTarget;
            let contains = this.contains(captured);
            if (!captured) {
                captured = e.target;
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
    openedChanged() {
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
    toggleOpened(force) {
        this.opened = force ? force : !this.opened;
        this.debounce = false;
    }
}
__decorate(
    [
        attr({
            attribute: "menu",
            mode: "boolean",
        }),
    ],
    Navigation.prototype,
    "menu",
    void 0
);
__decorate([observable], Navigation.prototype, "opened", void 0);
__decorate([observable], Navigation.prototype, "debounce", void 0);
__decorate([observable], Navigation.prototype, "slottedNavigationItems", void 0);
applyMixins(Navigation, StartEnd);
