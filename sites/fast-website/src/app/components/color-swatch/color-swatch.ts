import { attr, observable } from "@microsoft/fast-element";
import { FASTRadio } from "@microsoft/fast-components";

export class ColorSwatch extends FASTRadio {
    @attr
    public backgroundColor: string = "#F33378";

    @observable 
    public defaultSlottedNodes: Node[];
}
