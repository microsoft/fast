import { FASTElement, attr } from "@microsoft/fast-element";

export class SectionHeader extends FASTElement {
    @attr
    public title: string;

    @attr({ attribute: "sub-title" })
    public subTitle: string;

    @attr
    public description: string;

    @attr({ attribute: "button-text" })
    public buttonText: string;
}
