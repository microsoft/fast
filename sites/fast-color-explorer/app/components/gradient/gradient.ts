import { attr, observable } from "@microsoft/fast-element";
import { FoundationElement } from "@microsoft/fast-foundation";

export class Gradient extends FoundationElement {
    @observable
    colors: string[];

    @attr({ attribute: "marked-color" })
    markedColor: string;
}
