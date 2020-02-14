import { attr, FastElement } from "@microsoft/fast-element";

export class NameTag extends FastElement {
    @attr
    public greeting: string = "Hello";
}
