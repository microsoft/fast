import { FASTElement, attr } from "@microsoft/fast-element";

export class SectionHeader extends FASTElement {
    @attr
    public short: string;

    @attr
    public body: string;
}
