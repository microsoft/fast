import { FASTElement, observable } from "@microsoft/fast-element";

export class Navigation extends FASTElement {
    @observable
    items: HTMLElement[];
}
