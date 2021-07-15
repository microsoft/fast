import { FASTElement } from "@microsoft/fast-element";
import { StartEnd } from "@microsoft/fast-foundation";
export declare class Navigation extends FASTElement {
    menu: boolean;
    opened: boolean;
    debounce: boolean;
    slottedNavigationItems: Node[];
    widthOffset: number;
    mediaQueryList: MediaQueryList;
    htmlElement: HTMLElement;
    mqlListener: (e: MediaQueryListEvent) => void;
    openedChanged(): void;
    menuChanged(): void;
    connectedCallback(): void;
    toggleOpened(force?: boolean): void;
    handleFocusOut: (e: FocusEvent) => void;
}
export interface Navigation extends StartEnd {}
