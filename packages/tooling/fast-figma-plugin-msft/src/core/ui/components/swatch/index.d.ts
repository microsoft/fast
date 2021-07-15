import { FASTElement } from "@microsoft/fast-element";
export declare enum SwatchTypes {
    background = "background",
    border = "border",
}
export declare class Swatch extends FASTElement {
    type: SwatchTypes;
    circular: boolean;
    value: string | "none";
    orientation: "horizontal" | "vertical";
    label: string;
    interactive: boolean;
    selected: boolean;
}
