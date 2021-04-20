import { attr, observable } from "@microsoft/fast-element";
import { Radio } from "@microsoft/fast-foundation";

export class ColorSwatch extends Radio {
    @attr({ attribute: "background-color" })
    public backgroundColor: string = "#F33378";

    @observable
    public defaultSlottedNodes: Node[];
}
