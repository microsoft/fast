import { customElement, attr } from "@microsoft/fast-element";
import { Badge, BadgeTemplate as template } from "@microsoft/fast-components";
import { BadgeStyles as styles } from "./badge.styles";

export type BadgeFill = "accent" | "lightweight" | "neutral";

@customElement({
    name: "msft-badge",
    template,
    styles,
})
export class MSFTBadge extends Badge {
    @attr
    public fill: BadgeFill = "lightweight";
    private fillChanged(oldValue: BadgeFill, newValue: BadgeFill): void {
        if (oldValue !== newValue) {
            this.classList.add(newValue);
            this.classList.remove(oldValue);
        }
    }

    // Can we remove this and circular as attrs if we don't want to leverage them?
    // Can I set this internally only in this implementation?
    @attr({ mode: "fromView" })
    public color: string = "value";
}
