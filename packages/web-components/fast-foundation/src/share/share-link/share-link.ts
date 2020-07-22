import { attr, FASTElement, observable } from "@microsoft/fast-element";

export class ShareLink extends FASTElement {
    /**
     * The title of the share link
     * @public
     */
    @attr
    public title: string;

    @attr
    public color: string;

    @observable
    public items: HTMLElement[];
}
