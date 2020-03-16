import { attr, FastElement } from "@microsoft/fast-element";

export enum BadgeSize {
    small = "small",
    medium = "medium",
    large = "large",
}

export class Badge extends FastElement {
    @attr({ attribute: "fill" })
    public fill: string;

    // Revisit this once we have a better
    // story for ensuring proper contrast
    // from author defined `fill`
    @attr({ attribute: "color" })
    public color: string;

    @attr
    public size: BadgeSize;
    private sizeChanged(): void {
        switch (this.size) {
            case BadgeSize.small:
                this.classList.add("small");
                break;
            case BadgeSize.medium:
                this.classList.add("medium");
                break;
            case BadgeSize.large:
                this.classList.add("large");
                break;
            default:
                this.classList.add("medium");
                break;
        }
    }

    @attr
    public circular: boolean;
    private circularChanged(): void {
        this.circular
            ? this.classList.add("circular")
            : this.classList.remove("circular");
    }
}
