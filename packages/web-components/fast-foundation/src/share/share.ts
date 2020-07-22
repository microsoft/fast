import { attr, FASTElement, observable } from "@microsoft/fast-element";

export class Share extends FASTElement {
    /**
     * The title of the share
     * @public
     */
    @attr
    public title: string;

    @observable
    public items: HTMLElement[];

    @observable
    public tabItem: HTMLElement[];
}
