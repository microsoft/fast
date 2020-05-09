import { FASTElement, attr, observable } from "@microsoft/fast-element";

export class SiteNavigation extends FASTElement {
    @attr
    public item: string;

    @observable
    public items: string[] = [];
}
