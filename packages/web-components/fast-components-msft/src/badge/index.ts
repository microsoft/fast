import { attr, customElement } from "@microsoft/fast-element";
import { Badge, BadgeTemplate as template } from "@microsoft/fast-foundation";
import { BadgeStyles as styles } from "./badge.styles";

export type BadgeFill = "accent" | "lightweight" | "neutral" | "string";

@customElement({
    name: "fast-badge",
    template,
    styles,
})
export class FASTBadge extends Badge {
    @attr
    public fill: BadgeFill = "lightweight";
    private fillChanged(oldValue: BadgeFill, newValue: BadgeFill): void {
        if (oldValue !== newValue) {
            this.classList.add(newValue);
            this.classList.remove(oldValue);
        }
    }
}
