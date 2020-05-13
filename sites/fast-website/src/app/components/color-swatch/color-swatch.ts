import { attr } from "@microsoft/fast-element";
import { FASTRadio } from "@microsoft/fast-components";

export class ColorSwatch extends FASTRadio {
    @attr
    public backgroundColor: string = "#F33378";
}
