import { attr, FASTElement, observable } from "@microsoft/fast-element";

export class ShareGroup extends FASTElement {
    /**
     * The title of the share group
     * @public
     */
    @attr
    public title: string;

    @observable
    public items: HTMLElement[];
}
