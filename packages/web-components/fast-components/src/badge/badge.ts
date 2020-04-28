import { attr, FASTElement } from "@microsoft/fast-element";

export class Badge extends FASTElement {
    @attr({ attribute: "fill" })
    public fill: string;

    // Revisit this once we have a better
    // story for ensuring proper contrast
    // from author defined `fill`
    @attr({ attribute: "color" })
    public color: string;

    @attr({ mode: "boolean" })
    public circular: boolean;
}
