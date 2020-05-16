import { attr, FASTElement } from "@microsoft/fast-element";
import { ButtonAppearance } from "../button/button";
import { StartEnd } from "../patterns/start-end";
import { applyMixins } from "../utilities/apply-mixins";

export type AnchorAppearance = ButtonAppearance | "hypertext";
export class Anchor extends FASTElement {
    @attr
    public appearance: AnchorAppearance = "neutral";

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

/* eslint-disable-next-line */
export interface Anchor extends StartEnd {}
applyMixins(Anchor, StartEnd);
