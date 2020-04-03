import { attr, FastElement, html } from "@microsoft/fast-element";
import { ButtonAppearance } from "./button";

export const anchorTemplate = html<Anchor>`
    <a
        download="${x => x.download}"
        href="${x => x.href}"
        hreflang="${x => x.hreflang}"
        ping="${x => x.lang}"
        referrerpolicy="${x => x.referrerpolicy}"
        rel="${x => x.rel}"
        target="${x => x.target}"
        type="${x => x.type}"
    >
        <slot slot="start"></slot>
        <slot></slot>
        <slot slot="end"></slot>
    </a>
`;

export class Anchor extends FastElement {
    @attr
    public appearance: ButtonAppearance = ButtonAppearance.neutral;
    public appearanceChanged(): void {
        this.appearance
            ? this.classList.add(`${ButtonAppearance[this.appearance]}`)
            : this.classList.remove(`${ButtonAppearance[this.appearance]}`);
    }

    @attr
    public download: string;

    @attr
    public href: string;

    @attr
    public hreflang: string;

    @attr
    public ping: string;

    @attr
    public referrerpolicy: string;

    @attr
    public rel: string;

    @attr
    public target: "_self" | "_blank" | "_parent" | "_top";

    @attr
    public type: string;
}
