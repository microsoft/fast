import { attr, FASTElement } from "@microsoft/fast-element";

export class NavigationItem extends FASTElement {
    @attr
    href: string;
}
