import { customElement, FastElement, attr, html } from "@microsoft/fast-element";

const template = html<Anchor>`
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
        <slot slot="after"></slot>
        <slot></slot>
        <slot slot="after"></slot>
    </a>
`;

export class Anchor extends FastElement {
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
    public target: "_self" | "_blank" | "_parent" | "_self" | "_top";

    @attr
    public type: string;
}
