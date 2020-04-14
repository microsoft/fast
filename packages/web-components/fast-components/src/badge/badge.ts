import { attr, FastElement } from "@microsoft/fast-element";

export class Badge extends FastElement {
    @attr({ attribute: "fill" })
    public fill: string;

    // Revisit this once we have a better
    // story for ensuring proper contrast
    // from author defined `fill`
    @attr({ attribute: "color" })
    public color: string;

    @attr({ mode: "boolean" })
    public circular: boolean;
    private circularChanged(): void {
        this.circular
            ? this.classList.add("circular")
            : this.classList.remove("circular");
    }
}
