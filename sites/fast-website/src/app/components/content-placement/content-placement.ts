import { FASTElement, attr } from "@microsoft/fast-element";

export class ContentPlacement extends FASTElement {
    @attr({ mode: "boolean" }) divider: boolean = false;
}
