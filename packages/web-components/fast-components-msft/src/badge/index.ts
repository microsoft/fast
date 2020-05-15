import { attr, customElement } from "@microsoft/fast-element";
import { Badge, BadgeTemplate as template } from "@microsoft/fast-foundation";
import { BadgeStyles as styles } from "./badge.styles";

export type BadgeAppearance = "accent" | "lightweight" | "neutral" | string;

@customElement({
    name: "fast-badge",
    template,
    styles,
})
export class FASTBadge extends Badge {
    @attr({ mode: "fromView" })
    public appearance: BadgeAppearance = "lightweight";
    private appearanceChanged(
        oldValue: BadgeAppearance,
        newValue: BadgeAppearance
    ): void {
        if (oldValue !== newValue) {
            this.classList.add(newValue);
            this.classList.remove(oldValue);
        }
    }
}
