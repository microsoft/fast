import { FASTElement, observable } from "@microsoft/fast-element";
import { applyMixins, StartEnd } from "@microsoft/fast-foundation";

export class Navigation extends FASTElement {
    @observable
    public opened: boolean = false;

    public handleOpenNavClick = (e: Event): void => {
        this.opened = !this.opened;
    };
}

/* eslint-disable-next-line */
export interface Navigation extends StartEnd {}
applyMixins(Navigation, StartEnd);
