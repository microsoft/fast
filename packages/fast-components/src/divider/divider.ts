import { attr, FastElement } from "@microsoft/fast-element";

export enum DividerRole {
    separator = "separator",
    presentation = "presentation",
}

export class Divider extends FastElement {
    @attr
    public role: DividerRole = DividerRole.separator;
}
