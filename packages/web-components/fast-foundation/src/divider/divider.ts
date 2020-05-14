import { attr, FASTElement } from "@microsoft/fast-element";

export enum DividerRole {
    separator = "separator",
    presentation = "presentation",
}

export class Divider extends FASTElement {
    @attr
    public role: DividerRole = DividerRole.separator;
}
